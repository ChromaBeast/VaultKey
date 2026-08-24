import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SecretItem } from '../lib/api';
import {
  createSecret,
  errorMessage,
  fetchProjects,
  fetchSecrets,
  isAbortError,
  revealSecretValue,
  updateSecretValue,
} from '../lib/api';
import { pushToast } from '../lib/toast';
import { BentoGridMetrics } from '../components/BentoGridMetrics';
import { CreateSecretModal } from '../components/CreateSecretModal';
import { DeleteSecretDialog } from '../components/DeleteSecretDialog';
import { RevealSecretModal } from '../components/RevealSecretModal';
import { SecretsHeaderBar } from '../components/SecretsHeaderBar';
import { SecretsTable } from '../components/SecretsTable';
import { SecretGeneratorModal } from '../components/SecretGeneratorModal';
import { SecretVersionHistoryModal } from '../components/SecretVersionHistoryModal';

type ModalTarget = { mode: 'create' | 'edit'; initialKey?: string; initialValue?: string };

export const SecretsPage: React.FC = () => {
  const { org } = useAuth();
  const [secrets, setSecrets] = useState<SecretItem[]>([]);
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('default');
  const [projects, setProjects] = useState<string[]>(['default']);
  const [loading, setLoading] = useState(true);
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null);
  const [genOpen, setGenOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState<{ key: string; version: number } | null>(null);
  const [deleteItem, setDeleteItem] = useState<SecretItem | null>(null);
  const [revealedVal, setRevealedVal] = useState<{ key: string; val: string } | null>(null);
  const [revealPendingKey, setRevealPendingKey] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const projectRef = useRef(project);

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let mounted = true;
    const load = async () => {
      try {
        const list = await fetchSecrets(project, ctrl.signal);
        const projList = await fetchProjects(ctrl.signal);
        if (!mounted || ctrl.signal.aborted) return;
        setSecrets(list || []);
        const merged = projList && projList.length > 0 ? projList : ['default'];
        setProjects(merged.includes(project) ? merged : [...merged, project]);
      } catch (err) {
        if (isAbortError(err) || !mounted) return;
        pushToast(errorMessage(err, 'Failed to load secrets'), 'error');
      } finally {
        if (mounted && abortRef.current === ctrl) {
          abortRef.current = null;
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [project]);

  const refresh = () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    void (async () => {
      try {
        const list = await fetchSecrets(projectRef.current, ctrl.signal);
        const projList = await fetchProjects(ctrl.signal);
        if (!ctrl.signal.aborted) {
          setSecrets(list || []);
          const merged = projList && projList.length > 0 ? projList : ['default'];
          setProjects(merged.includes(projectRef.current) ? merged : [...merged, projectRef.current]);
        }
      } catch (err) {
        if (!isAbortError(err)) pushToast(errorMessage(err, 'Failed to load secrets'), 'error');
      } finally {
        if (abortRef.current === ctrl) {
          abortRef.current = null;
          setLoading(false);
        }
      }
    })();
  };

  const handleSubmitSecret = async (key: string, value: string) => {
    try {
      if (modalTarget?.mode === 'edit') {
        await updateSecretValue(key, value, project);
        pushToast('Secret value updated and re-encrypted', 'success');
      } else {
        await createSecret(key, value, project);
        pushToast('Secret encrypted and stored', 'success');
      }
      setModalTarget(null);
      refresh();
    } catch (err) {
      pushToast(errorMessage(err), 'error');
      throw err;
    }
  };

  const handleReveal = async (key: string) => {
    setRevealPendingKey(key);
    try {
      const res = await revealSecretValue(key, project);
      setRevealedVal({ key, val: res.value });
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to reveal secret'), 'error');
    } finally {
      setRevealPendingKey(null);
    }
  };

  const startEdit = async (item: SecretItem) => {
    try {
      const res = await revealSecretValue(item.key, project);
      setModalTarget({ mode: 'edit', initialKey: item.key, initialValue: res.value });
    } catch (err) {
      pushToast(errorMessage(err, 'Could not load secret for editing'), 'error');
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <SecretsHeaderBar
        secretCount={secrets.length}
        showBadge={Boolean(org)}
        search={search}
        onSearchChange={setSearch}
        project={project}
        projects={projects}
        onProjectChange={setProject}
        onOpenGenerator={() => setGenOpen(true)}
        onCreateSecret={() => setModalTarget({ mode: 'create', initialKey: '', initialValue: '' })}
      />

      <BentoGridMetrics totalSecrets={secrets.length} activeProject={project} projectCount={projects.length} />

      <SecretsTable
        secrets={secrets}
        loading={loading}
        search={search}
        project={project}
        revealPendingKey={revealPendingKey}
        onReveal={(key) => void handleReveal(key)}
        onHistory={(item) => setHistoryItem({ key: item.key, version: item.version })}
        onEdit={(item) => void startEdit(item)}
        onDelete={setDeleteItem}
        onCreate={() => setModalTarget({ mode: 'create', initialKey: '', initialValue: '' })}
        onClearSearch={() => setSearch('')}
      />

      {genOpen && (
        <SecretGeneratorModal
          isOpen
          onClose={() => setGenOpen(false)}
          onUseSecret={(secret) => setModalTarget({ mode: 'create', initialKey: '', initialValue: secret })}
        />
      )}
      {modalTarget !== null && (
        <CreateSecretModal
          isOpen
          project={project}
          mode={modalTarget.mode}
          initialKey={modalTarget.initialKey}
          initialValue={modalTarget.initialValue}
          onClose={() => setModalTarget(null)}
          onSubmit={handleSubmitSecret}
          onOpenGenerator={() => setGenOpen(true)}
        />
      )}
      {historyItem && (
        <SecretVersionHistoryModal
          secretKey={historyItem.key}
          project={project}
          currentVersion={historyItem.version}
          onClose={() => setHistoryItem(null)}
          onRollbackSuccess={refresh}
        />
      )}
      {revealedVal && (
        <RevealSecretModal
          secretKey={revealedVal.key}
          secretVal={revealedVal.val}
          onClose={() => setRevealedVal(null)}
        />
      )}
      <DeleteSecretDialog
        item={deleteItem}
        project={project}
        onClose={() => setDeleteItem(null)}
        onDeleted={refresh}
      />
    </div>
  );
};

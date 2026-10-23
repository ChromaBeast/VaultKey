import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CREATE_SECRET_EVENT } from '../lib/events';
import { canWriteSecrets } from '../lib/permissions';
import { useAuth } from '../context/AuthContext';
import type { SecretItem } from '../lib/api';
import { createSecret, errorMessage, fetchProjects, fetchSecrets, isAbortError, revealSecretValue, updateSecretValue } from '../lib/api';
import { pushToast } from '../lib/toast';
import { SecretsHeaderBar } from '../components/SecretsHeaderBar';
import { SecretsCommandBar } from '../components/SecretsCommandBar';
import { SecretsTable } from '../components/SecretsTable';
import { SecretsModals, type ModalTarget } from '../components/SecretsModals';
export const SecretsPage: React.FC = () => {
  const { org, user } = useAuth();
  const canWrite = canWriteSecrets(user?.role);
  const location = useLocation();
  const navigate = useNavigate();
  const [secrets, setSecrets] = useState<SecretItem[]>([]);
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('default');
  const [projects, setProjects] = useState<string[]>(['default']);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(() => canWrite && location.state?.createSecret ? { mode: 'create' } : null);
  const [genOpen, setGenOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState<{ key: string; version: number } | null>(null);
  const [deleteItem, setDeleteItem] = useState<SecretItem | null>(null);
  const [revealedVal, setRevealedVal] = useState<{ key: string; val: string } | null>(null);
  const [revealPendingKey, setRevealPendingKey] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const projectRef = useRef(project);
  const revealRequest = useRef(0);
  useEffect(() => {
    projectRef.current = project;
    return () => { revealRequest.current += 1; abortRef.current?.abort(); };
  }, [project]);
  useEffect(() => {
    const create = () => { if (canWrite) setModalTarget({ mode: "create" }); };
    window.addEventListener(CREATE_SECRET_EVENT, create);
    if (location.state?.createSecret) navigate(location.pathname, { replace: true, state: null });
    return () => window.removeEventListener(CREATE_SECRET_EVENT, create);
  }, [location, navigate, canWrite]);
  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [list, projList] = await Promise.all([fetchSecrets(project, ctrl.signal), fetchProjects(ctrl.signal)]);
        if (!mounted || ctrl.signal.aborted) return;
        setSecrets(list || []);
        const merged = projList && projList.length > 0 ? projList : ['default'];
        setProjects(merged.includes(project) ? merged : [...merged, project]);
      } catch (err) {
        if (isAbortError(err) || !mounted) return;
        setLoadError(errorMessage(err, 'Failed to load secrets'));
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
    setLoadError(null);
    void (async () => {
      try {
        const [list, projList] = await Promise.all([fetchSecrets(projectRef.current, ctrl.signal), fetchProjects(ctrl.signal)]);
        if (!ctrl.signal.aborted) {
          setSecrets(list || []);
          const merged = projList && projList.length > 0 ? projList : ['default'];
          setProjects(merged.includes(projectRef.current) ? merged : [...merged, projectRef.current]);
        }
      } catch (err) {
        if (!isAbortError(err) && abortRef.current === ctrl) setLoadError(errorMessage(err, 'Failed to load secrets'));
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
    const request = ++revealRequest.current;
    setRevealPendingKey(key);
    try {
      const res = await revealSecretValue(key, project);
      if (request === revealRequest.current) setRevealedVal({ key, val: res.value });
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to reveal secret'), 'error');
    } finally {
      if (request === revealRequest.current) setRevealPendingKey(null);
    }
  };
  const startEdit = async (item: SecretItem) => {
    const request = ++revealRequest.current;
    try {
      const res = await revealSecretValue(item.key, project);
      if (request === revealRequest.current) setModalTarget({ mode: 'edit', initialKey: item.key, initialValue: res.value });
    } catch (err) {
      pushToast(errorMessage(err, 'Could not load secret for editing'), 'error');
    }
  };
  return (
    <div className="animate-fade">
      <SecretsHeaderBar
        canWrite={canWrite}
        secretCount={secrets.length}
        showBadge={Boolean(org)}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        project={project}
        projects={projects}
        onProjectChange={(next) => {
          revealRequest.current += 1;
          projectRef.current = next;
          setRevealPendingKey(null);
          setRevealedVal(null);
          setModalTarget(null);
          setHistoryItem(null);
          setDeleteItem(null);
          setProject(next);
        }}
        onOpenGenerator={() => setGenOpen(true)}
        onCreateSecret={() => setModalTarget({ mode: 'create', initialKey: '', initialValue: '' })}
      />
      <SecretsCommandBar project={project} />
      {loadError ? <div className="load-error" role="alert">
        <div><h2>Could not load secrets</h2><p>{loadError}</p></div>
        <button className="btn btn-secondary" onClick={refresh}>Retry</button>
      </div> : <SecretsTable
        canWrite={canWrite}
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
      />}
      <SecretsModals
        canWrite={canWrite}
        project={project}
        genOpen={genOpen}
        onCloseGen={() => setGenOpen(false)}
        onUseGeneratedSecret={(secret) => setModalTarget({ mode: 'create', initialKey: '', initialValue: secret })}
        modalTarget={modalTarget}
        onCloseModalTarget={() => setModalTarget(null)}
        onSubmitSecret={handleSubmitSecret}
        historyItem={historyItem}
        onCloseHistory={() => setHistoryItem(null)}
        onRollbackSuccess={refresh}
        revealedVal={revealedVal}
        onCloseReveal={() => setRevealedVal(null)}
        deleteItem={deleteItem}
        onCloseDelete={() => setDeleteItem(null)}
        onDeleted={refresh}
      />
    </div>
  );
};

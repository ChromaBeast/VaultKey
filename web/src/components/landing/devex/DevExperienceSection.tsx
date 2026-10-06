import React from 'react';
import { Link } from 'react-router-dom';
import { RunCommand } from './RunCommand';

export const DevExperienceSection: React.FC = () => {
  return (
    <section id="workflow" className="section-shell">
      <div className="section-header">
        <h2 className="section-title">Run your app with one command.</h2>
        <p className="section-subtitle">VaultKey gives your app the passwords and keys it needs when you start it.</p>
      </div>

      <div className="workflow-layout">
        <ol className="workflow-steps">
          <li><h3>Store a secret</h3><p>Create a project and add your application's keys in the dashboard.</p></li>
          <li><h3>Connect the CLI</h3><p>Install the CLI and configure your server URL and a scoped API token.</p></li>
          <li><h3>Run your app</h3><p>Inject your project's secrets into the process without writing a local file.</p></li>
        </ol>
        <div><RunCommand /><Link to="/docs#cli" className="mt-5 inline-flex text-sm text-primary hover:underline">Read the CLI setup guide →</Link></div>
      </div>
    </section>
  );
};

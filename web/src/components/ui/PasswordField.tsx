import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  value,
  onChange,
  label = 'Password',
  placeholder = '••••••••••••',
  required = true,
  minLength,
  autoComplete = 'current-password',
  autoFocus = false,
  disabled = false,
  style,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div style={style}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--vk-text-secondary)',
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required={required}
          minLength={minLength}
          autoFocus={autoFocus}
          disabled={disabled}
          autoComplete={autoComplete}
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ width: '100%', paddingRight: '38px' }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--vk-text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

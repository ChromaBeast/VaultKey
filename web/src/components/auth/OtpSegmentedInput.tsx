import React, { useRef } from 'react';

interface OtpSegmentedInputProps {
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  disabled?: boolean;
}

export const OtpSegmentedInput: React.FC<OtpSegmentedInputProps> = ({
  value,
  onChange,
  onComplete,
  disabled = false,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      const next = digits.map((d, i) => (i === index ? '' : d)).join('');
      onChange(next);
      return;
    }

    const digit = rawVal.slice(-1);
    const nextArr = [...digits];
    nextArr[index] = digit;
    const nextVal = nextArr.join('');
    onChange(nextVal);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    if (nextVal.length === 6 && onComplete) {
      onComplete(nextVal);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    const targetIdx = Math.min(pasted.length, 5);
    inputsRef.current[targetIdx]?.focus();
    if (pasted.length === 6 && onComplete) {
      onComplete(pasted);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '24px 0' }}>
      {digits.map((digit, i) => (
        <React.Fragment key={i}>
          {i === 3 && (
            <span
              style={{
                color: 'var(--vk-text-muted)',
                fontSize: '1.2rem',
                fontWeight: 600,
                userSelect: 'none',
                margin: '0 4px',
              }}
            >
              —
            </span>
          )}
          <input
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={digit}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{
              width: '46px',
              height: '52px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--vk-surface-2)',
              border: digit ? '1px solid var(--vk-accent)' : '1px solid var(--vk-border)',
              textAlign: 'center',
              fontSize: '1.4rem',
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--vk-text)',
              outline: 'none',
              boxShadow: digit ? '0 0 10px rgba(60, 237, 235, 0.2)' : 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

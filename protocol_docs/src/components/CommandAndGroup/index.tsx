import React from 'react';
import styles from './styles.module.css';

export default function CommandAndGroup({group, command}): JSX.Element {
  return (
    <div className={styles.chip}>
      <span>
        Group: <b>0x{group.toUpperCase()}</b> Command:{' '}
        <b>0x{command.toUpperCase()}</b>
      </span>{' '}
      <span style={{display: 'none'}}>
        0x{group}.0x{command}
      </span>
    </div>
  );
}

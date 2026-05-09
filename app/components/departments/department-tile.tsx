'use client';

import type { Department } from '@/lib/types/departments';
import { DepartmentIcon } from './department-icon';
import styles from './department-tile.module.scss';

interface DepartmentTileProps {
  department: Department;
}

export const DepartmentTile = ({ department }: DepartmentTileProps) => {
  return (
    <article className={styles.tile}>
      <span className={styles.iconWrap} aria-hidden='true'>
        <DepartmentIcon name={department.iconName} size={24} />
      </span>
      <h4 className={styles.label}>{department.displayName}</h4>
    </article>
  );
};

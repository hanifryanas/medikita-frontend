import type { Patient } from '../patients';
import type { UserRelationship } from './user-relationship.enum';

export interface UserPatient extends Patient {
  userId: string;
  relationship: UserRelationship;
  ordinal: number;
}

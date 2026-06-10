import { UserRelationship } from '@/lib/types/users';

export const USER_RELATIONSHIP_LABEL: Record<UserRelationship, string> = {
  [UserRelationship.Self]: 'Self',
  [UserRelationship.Spouse]: 'Spouse',
  [UserRelationship.Child]: 'Child',
  [UserRelationship.Parent]: 'Parent',
  [UserRelationship.Sibling]: 'Sibling',
  [UserRelationship.Other]: 'Other',
};

export const USER_RELATIONSHIP_OPTIONS: { value: UserRelationship; label: string }[] =
  Object.values(UserRelationship).map((value) => ({
    value,
    label: USER_RELATIONSHIP_LABEL[value],
  }));

export const formatUserRelationship = (relationship: UserRelationship): string =>
  USER_RELATIONSHIP_LABEL[relationship];

import { StaffDataType } from '../rootType';
import {
  actionAdminActivateUser,
  actionAdminDeactivateUser,
  actionAdminFinishProject,
  actionAdminGetAllDataFromProject,
  actionAdminGetAllDataFromStaff,
  actionAdminGetAllDataFromUser,
  actionAdminHardDeleteUser,
  actionAdminRestoreStaff,
  actionAdminRestoreUser,
  actionAdminSoftDeleteStaff,
  actionAdminSoftDeleteUser,
  actionAdminUnFinishProject,
} from './admin.action';
import {
  setAdminState,
  forceRefetchAdminUsersData,
  forceRefetchAdminStaffsData,
} from './admin.slice';

type AdminActionTypeInitial = {
  'admin/setAdminState': Parameters<typeof setAdminState>[0];
  'admin/forceRefetchAdminUsersData': Parameters<
    typeof forceRefetchAdminUsersData
  >[0];
  'admin/forceRefetchAdminStaffsData': Parameters<
    typeof forceRefetchAdminStaffsData
  >[0];
  'ADMIN/GET-ALL-DATA-FROM-USER': Parameters<
    typeof actionAdminGetAllDataFromUser
  >[0];
  'ADMIN/GET-ALL-DATA-FROM-STAFF': Parameters<
    typeof actionAdminGetAllDataFromStaff
  >[0];
  'ADMIN/GET-ALL-DATA-FROM-PROJECT': Parameters<
    typeof actionAdminGetAllDataFromProject
  >[0];
  'ADMIN/SOFT-DELETE-USER': Parameters<typeof actionAdminSoftDeleteUser>[0];
  'ADMIN/SOFT-DELETE-STAFF': Parameters<typeof actionAdminSoftDeleteStaff>[0];
  'ADMIN/RESTORE-USER': Parameters<typeof actionAdminRestoreUser>[0];
  'ADMIN/RESTORE-STAFF': Parameters<typeof actionAdminRestoreStaff>[0];
  'ADMIN/ACTIVATE-USER': Parameters<typeof actionAdminActivateUser>[0];
  'ADMIN/DEACTIVATE-USER': Parameters<typeof actionAdminDeactivateUser>[0];
  'ADMIN/HARD-DELETE-USER': Parameters<typeof actionAdminHardDeleteUser>[0];
  'ADMIN/FINISH-PROJECT': Parameters<typeof actionAdminFinishProject>[0];
  'ADMIN/UNFINISH-PROJECT': Parameters<typeof actionAdminUnFinishProject>[0];
};

type AdminActionTypeBase<T extends keyof AdminActionTypeInitial> = {
  type: T;
  payload: AdminActionTypeInitial[T];
};

export type AdminActionType = {
  [K in keyof AdminActionTypeInitial]: AdminActionTypeBase<K>;
}[keyof AdminActionTypeInitial];

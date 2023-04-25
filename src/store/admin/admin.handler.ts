import { call, put } from 'redux-saga/effects';
import { handleHideBaseModal, setBaseState } from '../base/base.slice';

import { GetAllDataFromUserType, UserDataType } from '../rootType';
import {
  requestAdminActivateUser,
  requestAdminDeactivateUser,
  requestAdminGetAllDataFromUser,
  requestAdminHardDeleteUser,
  requestAdminRestoreUser,
  requestAdminSoftDeleteUser,
} from './admin.request';
import { forceRefetchAdminUsersData, setAdminState } from './admin.slice';

export function* handleAdminGetAllDataFromUser(action: {
  type: string;
  payload: GetAllDataFromUserType;
}) {
  yield put(setAdminState({ state: 'loadingGetUsersData', value: true }));
  try {
    const { data } = yield call(requestAdminGetAllDataFromUser, action.payload);
    if (data) {
      const usersData: UserDataType[] = data.data;
      const tableTotalPage: number = data.totalPages;
      yield put(setAdminState({ state: 'usersData', value: usersData }));
      yield put(
        setAdminState({ state: 'tableTotalPage', value: tableTotalPage })
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    yield put(setAdminState({ state: 'loadingGetUsersData', value: false }));
  }
}

export function* handleAdminSoftDeleteUser(action: {
  type: string;
  payload: UserDataType['id'];
}) {
  yield put(setBaseState({ state: 'loadingModalConfirm', value: true }));
  try {
    yield call(requestAdminSoftDeleteUser, action.payload);
    yield put(handleHideBaseModal());
    yield put(forceRefetchAdminUsersData());
  } catch (err) {
    console.log(err);
  } finally {
    yield put(setBaseState({ state: 'loadingModalConfirm', value: false }));
  }
}
export function* handleAdminRestoreUser(action: {
  type: string;
  payload: UserDataType['id'];
}) {
  yield put(setBaseState({ state: 'loadingModalConfirm', value: true }));
  try {
    yield call(requestAdminRestoreUser, action.payload);
    yield put(handleHideBaseModal());
    yield put(forceRefetchAdminUsersData());
  } catch (err) {
    console.log(err);
  } finally {
    yield put(setBaseState({ state: 'loadingModalConfirm', value: false }));
  }
}
export function* handleAdminActivateUser(action: {
  type: string;
  payload: UserDataType['id'];
}) {
  yield put(setBaseState({ state: 'loadingModalConfirm', value: true }));
  try {
    yield call(requestAdminActivateUser, action.payload);
    yield put(handleHideBaseModal());
    yield put(forceRefetchAdminUsersData());
  } catch (err) {
    console.log(err);
  } finally {
    yield put(setBaseState({ state: 'loadingModalConfirm', value: false }));
  }
}
export function* handleAdminDeactivateUser(action: {
  type: string;
  payload: UserDataType['id'];
}) {
  yield put(setBaseState({ state: 'loadingModalConfirm', value: true }));
  try {
    yield call(requestAdminDeactivateUser, action.payload);
    yield put(handleHideBaseModal());
    yield put(forceRefetchAdminUsersData());
  } catch (err) {
    console.log(err);
  } finally {
    yield put(setBaseState({ state: 'loadingModalConfirm', value: false }));
  }
}
export function* handleAdminHardDeleteUser(action: {
  type: string;
  payload: UserDataType['id'];
}) {
  yield put(setBaseState({ state: 'loadingModalConfirm', value: true }));
  try {
    yield call(requestAdminHardDeleteUser, action.payload);
    yield put(handleHideBaseModal());
    yield put(forceRefetchAdminUsersData());
  } catch (err) {
    console.log(err);
  } finally {
    yield put(setBaseState({ state: 'loadingModalConfirm', value: false }));
  }
}

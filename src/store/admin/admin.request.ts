import { privateAxios } from '~/axiosConfig';
import { GetAllDataFromUserType } from '../rootType';

export function requestAdminGetAllDataFromUser(
  payload: GetAllDataFromUserType
) {
  return privateAxios.request({
    method: 'GET',
    url: '/g/users/' + payload.type,
    params: payload.query,
  });
}

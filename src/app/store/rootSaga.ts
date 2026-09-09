import { all, fork } from 'redux-saga/effects';
import { authSaga } from '@/features/auth/authSaga';
import { employeeSaga } from '@/features/employees/employeeSaga';
import { requestSaga } from '@/features/requests/requestSaga';
import { surveySaga } from '@/features/surveys/surveySaga';
import { documentSaga } from '@/features/documents/documentSaga';
import { notificationSaga } from '@/features/notifications/notificationSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(employeeSaga),
    fork(requestSaga),
    fork(surveySaga),
    fork(documentSaga),
    fork(notificationSaga),
  ]);
}

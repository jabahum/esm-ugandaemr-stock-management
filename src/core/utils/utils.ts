import { User } from '../api/types/identity/User';

export const initialStockOperationValue = () => {
  return {
    atLocationName: '',
    atLocationUuid: '',
    cancelReason: '',
    cancelledBy: 0,
    cancelledByFamilyName: '',
    cancelledByGivenName: '',
    cancelledDate: undefined,
    completedBy: 0,
    completedByFamilyName: '',
    completedByGivenName: '',
    completedDate: undefined,
    creator: 0,
    creatorFamilyName: '',
    creatorGivenName: '',
    dateCreated: undefined,
    destinationName: '',
    destinationUuid: '',
    dispatchedByFamilyName: '',
    dispatchedByGivenName: '',
    dispatchedDate: undefined,
    externalReference: '',
    locked: false,
    operationDate: new Date(),
    operationNumber: '',
    operationOrder: 0,
    operationType: '',
    operationTypeName: '',
    operationTypeUuid: '',
    permission: undefined,
    reasonName: '',
    reasonUuid: '',
    rejectedByFamilyName: '',
    rejectedByGivenName: '',
    rejectedDate: undefined,
    rejectionReason: '',
    remarks: '',
    requisitionStockOperationUuid: '',
    responsiblePerson: 0,
    responsiblePersonFamilyName: '',
    responsiblePersonGivenName: '',
    responsiblePersonOther: '',
    responsiblePersonUuid: '',
    returnReason: '',
    returnedByFamilyName: '',
    returnedByGivenName: '',
    returnedDate: undefined,
    sourceName: '',
    sourceUuid: '',
    status: undefined,
    stockOperationItems: [],
    submitted: false,
    submittedBy: '',
    submittedByFamilyName: '',
    submittedByGivenName: '',
    submittedDate: undefined,
    uuid: '',
  };
};

export const otherUser: User = {
  uuid: 'Other',
  display: 'Other',
  person: {
    display: 'Other',
  },
} as unknown as User;

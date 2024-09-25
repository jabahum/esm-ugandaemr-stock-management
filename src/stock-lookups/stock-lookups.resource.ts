import {
  FetchResponse,
  OpenmrsResource,
  fhirBaseUrl,
  openmrsFetch,
  useSession,
  restBaseUrl,
} from '@openmrs/esm-framework';
import { ResourceFilterCriteria, toQueryParams } from '../core/api/api';
import { PageableResult } from '../core/api/types/PageableResult';
import { OpenMRSLocation, OpenMRSLocationTag } from '../core/api/types/Location';
import useSWR from 'swr';
import { Role } from '../core/api/types/identity/Role';
import { User } from '../core/api/types/identity/User';
import { StockOperationType } from '../core/api/types/stockOperation/StockOperationType';
import { Concept } from '../core/api/types/concept/Concept';
import { Party } from '../core/api/types/Party';
import { Drug } from '../core/api/types/concept/Drug';
import { Patient } from '../core/api/types/identity/Patient';
import { useMemo } from 'react';
import { uniqBy } from 'lodash-es';
import { UserRoleScope } from '../core/api/types/identity/UserRoleScope';

export type PatientFilterCriteria = ResourceFilterCriteria;

export type UserFilterCriteria = ResourceFilterCriteria;

export type DrugFilterCriteria = ResourceFilterCriteria;

export type ConceptFilterCriteria = ResourceFilterCriteria;

export type LocationFilterCriteria = ResourceFilterCriteria;
interface FHIRResponse {
  entry: Array<{ resource: fhir.Location }>;
  total: number;
  type: string;
  resourceType: string;
}

// getLocations
export function useStockLocations(filter: LocationFilterCriteria) {
  const apiUrl = `${restBaseUrl}/location${toQueryParams(filter, false)}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<OpenMRSLocation>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    locations: data?.data || <PageableResult<OpenMRSLocation>>{},
    isErrorLocation: error,
    isLoadingLocations: isLoading,
  };
}
/* Get locations tagged to perform stock related activities.
   Unless a location is tag as main store, main pharmacy or dispensing, it will not be fetched.
*/
export function useStockTagLocations() {
  const apiUrl = `${fhirBaseUrl}/Location?_summary=data&_tag=main store,main pharmacy,dispensary `;
  const { data, error, isLoading } = useSWR<{ data: FHIRResponse }>(apiUrl, openmrsFetch);
  const stockLocations = useMemo(
    () => data?.data?.entry?.map((response) => response.resource) ?? [],
    [data?.data?.entry],
  );
  return {
    stockLocations: uniqBy(stockLocations, 'id') ?? [],
    isLoading,
    error,
  };
}

// getLocationWithIdByUuid
export function useLocationWithIdByUuid(id: string) {
  const apiUrl = `${restBaseUrl}/stockmanagement/location/${id}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<OpenMRSLocation>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data.data ? data.data : [],
    isLoading,
    isError: error,
  };
}

//  deleteLocation
export function deleteLocation(id: string) {
  const apiUrl = `${restBaseUrl}/stockmanagement/location/${id}`;
  const abortController = new AbortController();
  return openmrsFetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });
}

// getLocationTags
export function useLocationTags(q: string) {
  const apiUrl = `${restBaseUrl}/locationtag?v=default${q && q.length > 0 ? '&q=' + encodeURIComponent(q) : ''}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<OpenMRSLocationTag>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data.data ? data.data : [],
    isLoading,
    isError: error,
  };
}

// getRoles
export function useRoles(filter: ResourceFilterCriteria) {
  const apiUrl = `${restBaseUrl}/role${toQueryParams(filter)}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<Role>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <PageableResult<Role>>{},
    isLoading,
    isError: error,
  };
}

// getStockOperationTypes
export function useStockOperationTypes() {
  const apiUrl = `${restBaseUrl}/stockmanagement/stockoperationtype?v=default`;
  const { data, isLoading, error } = useSWR<
    {
      data: PageableResult<StockOperationType>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    types: data?.data || <PageableResult<StockOperationType>>{},
    isLoading,
    isError: error,
  };
}

export function getStockOperationTypes(): Promise<FetchResponse<PageableResult<StockOperationType>>> {
  const apiUrl = `${restBaseUrl}/stockmanagement/stockoperationtype?v=default`;
  return openmrsFetch(apiUrl);
}

// getUsers
export function useUsers(filter: UserFilterCriteria) {
  const apiUrl = `${restBaseUrl}/user${toQueryParams(filter)}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<User>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <PageableResult<User>>{},
    isLoading,
    isError: error,
  };
}

// getUser
export function useUser(id: string) {
  const apiUrl = `${restBaseUrl}/user/${id}`;
  const { data, error, isLoading } = useSWR<
    {
      data: User;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    data: data?.data || <User>{},
    isLoading,
    isError: error,
  };
}

export function useConcept(conceptUuid: string) {
  const apiUrl = `${restBaseUrl}/concept/${conceptUuid}`;
  const { data, error, isLoading } = useSWR<
    {
      data: Concept;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <Concept>{},
    isLoading,
    isError: error,
  };
}

// getParties
export function useParties() {
  const apiUrl = `${restBaseUrl}/stockmanagement/party?v=default`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<Party>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <PageableResult<Party>>{},
    isLoading,
    isError: error,
  };
}

export function getParties(): Promise<FetchResponse<PageableResult<Party>>> {
  const apiUrl = `${restBaseUrl}/stockmanagement/party?v=default`;
  return openmrsFetch(apiUrl);
}

// getDrugs
export function useDrugs(filter: DrugFilterCriteria) {
  const apiUrl = `${restBaseUrl}/drug${toQueryParams(filter)}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<Drug>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <PageableResult<Drug>>{},
    isLoading,
    isError: error,
  };
}

// getConcepts
export function useConcepts(filter: ConceptFilterCriteria) {
  const apiUrl = `${restBaseUrl}/concept${toQueryParams(filter)}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<Concept>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data?.data || <PageableResult<Concept>>{},
    isLoading,
    isError: error,
  };
}

// getPatients
export function usePatients(filter: ConceptFilterCriteria) {
  const apiUrl = `${restBaseUrl}/patient${toQueryParams(filter)}`;
  const { data, error, isLoading } = useSWR<
    {
      data: PageableResult<Patient>;
    },
    Error
  >(apiUrl, openmrsFetch);
  return {
    items: data.data ? data.data : [],
    isLoading,
    isError: error,
  };
}

type UserRole = {
  results: Array<{
    userUuid: string;
    locations: Array<OpenmrsResource>;
    operationTypes: Array<{
      uuid: string;
      operationTypeName: string;
      operationTypeUuid: string;
    }>;
  }>;
};

export const useUserRoles = () => {
  const { user: loggedInUser } = useSession();
  const url = `${restBaseUrl}/stockmanagement/userrolescope`;
  const { data, isLoading, error } = useSWR<{ data: UserRole }>(url, openmrsFetch);
  const currentUserRoles = data?.data?.results.find((user) => user.userUuid === loggedInUser.uuid);
  return {
    userRoles: currentUserRoles,
    isLoading,
    error,
  };
};
export function getUserRoleScopes(): Promise<FetchResponse<PageableResult<UserRoleScope>>> {
  const apiUrl = `${restBaseUrl}/stockmanagement/userrolescope`;
  return openmrsFetch(apiUrl);
}

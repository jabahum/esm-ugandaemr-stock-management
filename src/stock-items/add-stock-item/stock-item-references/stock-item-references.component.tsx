import React, { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  DataTableSkeleton,
} from "@carbon/react";
import styles from "./stock-item-references.scss";
import { TrashCan, Save } from "@carbon/react/icons";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import StockSourceSelector from "./stock-references-selector.component";
import { useStockItemReferencesHook } from "./stock-item-references.resource";
import { zodResolver } from "@hookform/resolvers/zod";
import { StockItemReferenceData } from "./validation-schema";
import { stockItemDetailsSchema } from "../../validationSchema";
import {
  StockItemReference,
  StockItemReferenceDTO,
} from "../../../core/api/types/stockItem/StockItemReference";
import ControlledTextInput from "../../../core/components/carbon/controlled-text-input/controlled-text-input.component";
import {
  createStockItemReference,
  deleteStockItemReference,
} from "../../stock-items.resource";
import {
  showNotification,
  showSnackbar,
  showToast,
} from "@openmrs/esm-framework";

interface StockReferencesProps {
  isEditing?: boolean;
  onSubmit?: () => void;
  stockItemUuid: string;
}

const StockReferences: React.FC<StockReferencesProps> = ({
  isEditing,
  stockItemUuid,
}) => {
  const { t } = useTranslation();

  // get stock item references
  const { items, isLoading, setStockItemUuid } = useStockItemReferencesHook();
  useEffect(() => {
    setStockItemUuid(stockItemUuid);
  }, [stockItemUuid, setStockItemUuid]);

  const tableHeaders = useMemo(
    () => [
      {
        key: "source",
        header: t("source", "Source"),
        styles: { width: "50%" },
      },
      {
        key: "code",
        header: t("code", "Code"),
        styles: { width: "50%" },
      },
      {
        key: "action",
        header: t("action", "Actions"),
        styles: { width: "50%" },
      },
    ],
    [t]
  );

  const stockReferenceForm = useForm<StockItemReferenceData>({
    defaultValues: {},
    mode: "all",
    resolver: zodResolver(stockItemDetailsSchema),
  });

  const handleSaveStockItemReference = () => {
    const { getValues } = stockReferenceForm;
    const { code, references } = getValues();

    const payload: StockItemReference = {
      referenceCode: "",
      stockSource: undefined,
      stockItem: undefined,
      uuid: "",
      creator: undefined,
      dateCreated: undefined,
      changedBy: undefined,
      dateChanged: undefined,
      dateVoided: undefined,
      voidedBy: undefined,
      voidReason: "",
      voided: false,
    };

    createStockItemReference(payload).then(
      () =>
        showSnackbar({
          title: t("saveReferenceTitle", "StockItem Reference"),
          subtitle: t(
            "saveStockItemReferenceMessage",
            "Stock Item Reference saved successfully"
          ),
          kind: "success",
        }),
      () => {
        showSnackbar({
          title: t("saveStockItemReferenceErrorTitle", "StockItem Reference"),
          subtitle: t(
            "saveStockItemReferenceErrorMessage",
            "Error saving stock item reference"
          ),
          kind: "error",
        });
      }
    );
  };

  if (isLoading)
    return (
      <DataTableSkeleton
        showHeader={false}
        rowCount={5}
        columnCount={5}
        zebra
      />
    );

  return (
    <FormProvider {...stockReferenceForm}>
      <DataTable
        rows={items ?? []}
        headers={tableHeaders}
        isSortable={false}
        useZebraStyles={true}
        render={({ headers, getHeaderProps, getTableProps }) => (
          <TableContainer className={styles.referencesTableContainer}>
            <Table {...getTableProps()} className={styles.referencesTable}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      {...getHeaderProps({
                        header,
                        isSortable: false,
                      })}
                      style={header.styles}
                      key={header.key}
                    >
                      {header.header?.content ?? header.header}
                    </TableHeader>
                  ))}
                  <TableHeader style={{ width: "70%" }} />
                </TableRow>
              </TableHead>
              <TableBody className={styles.referencesTableBody}>
                {items?.map((row: StockItemReferenceDTO, index) => (
                  <StockReferencesRow row={row} key={`${index}-${row?.uuid}`} />
                ))}
                <StockReferencesRow row={{}} key="bottom-row" isEditing />
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />

      <Button
        name="save"
        type="submit"
        className="submitButton"
        onClick={handleSaveStockItemReference}
        kind="primary"
        renderIcon={Save}
      >
        {t("save", "Save")}
      </Button>
    </FormProvider>
  );
};
export default StockReferences;

const StockReferencesRow: React.FC<{
  isEditing?: boolean;
  row: StockItemReferenceDTO;
  key?: string;
}> = ({ isEditing, row, key }) => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const handleDelete = (e) => {
    e.preventDefault();
    deleteStockItemReference(row.uuid).then(
      () => {
        showToast({
          critical: true,
          title: t("deletePackagingUnitTitle", `Delete stock item reference`),
          kind: "success",
          description: t(
            "deleteStockItemReferenceMesaage",
            `Stock Item reference deleted Successfully`
          ),
        });
      },
      (error) => {
        showNotification({
          title: t(
            "deleteStockItemReferenceTitle",
            `Error Deleting a stock item reference`
          ),
          kind: "error",
          critical: true,
          description: error?.message,
        });
      }
    );
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <StockSourceSelector
            row={row}
            name="references"
            controllerName={"references"}
            control={control}
            placeholder={t("filter", "Filter...")}
          />
        ) : (
          (!isEditing || !row.uuid.startsWith("new-item")) &&
          row?.stockSourceName
        )}
      </TableCell>
      <TableCell>
        <div className={styles.referencesTableCell}>
          <ControlledTextInput
            id={`${row.uuid}-${key}`}
            name="code"
            control={control}
            size={"md"}
            value={row?.referenceCode}
            controllerName="code"
            labelText={""}
          />
          <Button
            type="button"
            size="sm"
            className="submitButton clear-padding-margin"
            iconDescription={"Delete"}
            kind="ghost"
            renderIcon={TrashCan}
            onClick={(e) => handleDelete(e)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

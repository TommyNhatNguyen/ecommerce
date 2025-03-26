import CustomEditor from "@/app/shared/components/CustomEditor";
import { Editor } from "ckeditor5";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { CheckInventoryInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useIntl } from "react-intl";
import { Input } from "antd";
import { InventoryCheckSummaryData } from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/hooks/useCreateCheck";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { ERROR_MESSAGE } from "@/app/constants/errors";

type Props = {
  control: Control<CheckInventoryInvoicesCreateDTO>;
  errors: FieldErrors<CheckInventoryInvoicesCreateDTO>;
  inventoryCheckSummaryData: InventoryCheckSummaryData;
};

const InventoryCheckSummary = ({
  control,
  errors,
  inventoryCheckSummaryData,
}: Props) => {
  const intl = useIntl();
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      {/* Summary Table */}
      <div className="flex flex-col gap-2">
        {/* TODO: Người kiểm kho  */}
        {/* Mã kiểm kho */}
        <div>
          <Controller
            control={control}
            name="code"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label={intl.formatMessage({ id: "invoice_code" })}
                placeholder={intl.formatMessage({ id: "invoice_code" })}
                error={errors.code?.message || ""}
                required={true}
                {...field}
              />
            )}
          />
        </div>
        {/* Thống kê */}
        <div className="flex flex-col gap-2">
          {/* Tổng số lượng thực tế */}
          <div className="flex items-center justify-between gap-2">
            <span>{intl.formatMessage({ id: "total_actual_quantity" })}</span>
            <span>
              {formatNumber(inventoryCheckSummaryData.total_actual_quantity)}
            </span>
          </div>
          {/* Tổng số lượng chênh lệch */}
          <div className="flex items-center justify-between gap-2">
            <span>
              {intl.formatMessage({ id: "total_difference_quantity" })}
            </span>
            <span>
              {formatNumber(
                inventoryCheckSummaryData.total_difference_quantity,
              )}
            </span>
          </div>
          {/* Tổng giá trị chênh lệch */}
          <div className="flex items-center justify-between gap-2">
            <span>{intl.formatMessage({ id: "total_difference_amount" })}</span>
            <span>
              {formatCurrency(
                inventoryCheckSummaryData.total_difference_amount,
              )}
            </span>
          </div>
        </div>
      </div>
      {/* Note */}
      <div className="mt-2">
        <Controller
          control={control}
          name="note"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "note" })}
              placeholder={intl.formatMessage({ id: "note" })}
              error={errors.note?.message || ""}
              required={true}
              {...field}
              customComponent={({ onChange, props }: any, ref: any) => (
                <CustomEditor
                  onChange={(_: any, editor: Editor) => {
                    field.onChange(editor.getData());
                  }}
                  {...props}
                  ref={ref}
                />
              )}
            />
          )}
        />
      </div>
    </div>
  );
};

export default InventoryCheckSummary;

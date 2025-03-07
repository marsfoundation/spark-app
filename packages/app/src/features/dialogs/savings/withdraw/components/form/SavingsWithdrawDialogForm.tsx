import { DialogForm, DialogFormProps } from '@/features/dialogs/common/components/form/DialogForm'
import { ControlledAddressInput } from '@/features/dialogs/savings/withdraw/components/form/ControlledAddressInput'
import { SendModeExtension } from '@/features/dialogs/savings/withdraw/types'
import { Form } from '@/ui/atoms/form/Form'
import { Alert } from '@/ui/molecules/alert/Alert'
import { testIds } from '@/ui/utils/testIds'

export interface SavingsWithdrawDialogFormProps extends DialogFormProps {
  sendModeExtension?: SendModeExtension
}

export function SavingsWithdrawDialogForm({ sendModeExtension, ...rest }: SavingsWithdrawDialogFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <DialogForm {...rest} />
      {sendModeExtension && (
        <Form {...sendModeExtension.receiverForm}>
          <div className="mt-2 mb-3 flex flex-col gap-2">
            <ControlledAddressInput
              label="Send to"
              form={sendModeExtension.receiverForm}
              blockExplorerUrl={sendModeExtension.blockExplorerAddressLink}
            />
            {sendModeExtension.showReceiverIsSmartContractWarning && (
              <Alert variant="warning" data-testid={testIds.dialog.savings.send.addressIsSmartContractWarning}>
                Provided receiver address is a smart contract address. <br />
                Make sure you trust the address before proceeding.
              </Alert>
            )}
          </div>
        </Form>
      )}
    </div>
  )
}

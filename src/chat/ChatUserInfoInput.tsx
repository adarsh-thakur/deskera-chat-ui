import { useEffect, useState } from "react";
import { isEmptyObject, isValidEmail, isValidPhone } from "../Utility/Utility";
import { DKButton } from "../components/common";

interface INPUT_DATA {
  type: "email" | "text";
  placeholder: string;
  validator: (value: string) => boolean;
  value: string;
}

const STEP_INPUT_DATA: { [key: string]: INPUT_DATA } = {
  EMAIL_STEP: {
    type: "email",
    placeholder: "Enter your business email...",
    validator: isValidEmail,
    value: ""
  },
  NAME_STEP: {
    type: "text",
    placeholder: "Enter your name...",
    validator: (name: string) => !isEmptyObject(name),
    value: ""
  },
  COMPANY_STEP: {
    type: "text",
    placeholder: "Enter your company...",
    validator: (company: string) => !isEmptyObject(company),
    value: ""
  },
  PHONE_STEP: {
    type: "text",
    placeholder: "+91 803 521 6752",
    validator: isValidPhone,
    value: ""
  }
};

export default function ChatUserInfoInput({
  stepId,
  defaultValue = "",
  onSend
}) {
  const [saveTapped, setSaveTapped] = useState(false);
  const [inputData, setInputData] = useState<INPUT_DATA>(null);

  useEffect(() => {
    const initialData = STEP_INPUT_DATA[stepId];

    if (!initialData) return;

    setInputData({ ...initialData, value: defaultValue || initialData.value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stepId) {
      setInputData({ ...STEP_INPUT_DATA[stepId] });
      setSaveTapped(null);
    }
  }, [stepId]);

  const isInputInvalid = () => !inputData.validator(inputData.value);

  const onTriggerSend = () => {
    setSaveTapped(true);

    if (isInputInvalid()) return;

    onSend(inputData.value);
  };

  return inputData ? (
    <div className="dk-chat-row dk-chat-ic-m dk-chat-m-v-r dk-chat-p-h-s">
      <input
        value={inputData.value}
        placeholder={inputData.placeholder}
        type={inputData.type}
        onChange={(e) => setInputData({ ...inputData, value: e.target.value })}
        className={
          "dk-chat-row dk-chat-parent-height dk-chat-pl-r dk-chat-border-m " +
          (saveTapped && isInputInvalid() ? " dk-chat-text-red" : "")
        }
        style={{
          borderRadius: "4px 0 0 4px",
          outline: "none",
          borderRight: "none"
        }}
      />
      <DKButton
        title={"Send"}
        className={
          "dk-chat-parent-height dk-chat-text-white dk-chat-fs-s-2 dk-chat-bg-blue"
        }
        style={{
          borderRadius: "0 4px 4px 0"
        }}
        onClick={onTriggerSend}
      />
    </div>
  ) : null;
}

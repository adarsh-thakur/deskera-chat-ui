/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { isEmptyObject, isValidEmail, isValidPhone } from "../Utility/Utility";
import { DKButton } from "../components/common";
import { AUTO_RESPONSE_KEYS, INPUT_TYPE } from "../Utility/Enum";

interface INPUT_DATA {
  type: INPUT_TYPE;
  placeholder: string;
  validator: (value: string) => boolean;
  value: string;
}

const STEP_INPUT_DATA: { [key: string]: INPUT_DATA } = {
  [AUTO_RESPONSE_KEYS.EMAIL_STEP]: {
    type: INPUT_TYPE.EMAIL,
    placeholder: "Enter your business email...",
    validator: isValidEmail,
    value: ""
  },
  [AUTO_RESPONSE_KEYS.NAME_STEP]: {
    type: INPUT_TYPE.TEXT,
    placeholder: "Enter your name...",
    validator: (name: string) => !isEmptyObject(name),
    value: ""
  },
  [AUTO_RESPONSE_KEYS.COMPANY_STEP]: {
    type: INPUT_TYPE.TEXT,
    placeholder: "Enter your company...",
    validator: (company: string) => !isEmptyObject(company),
    value: ""
  },
  [AUTO_RESPONSE_KEYS.PHONE_STEP]: {
    type: INPUT_TYPE.TEXT,
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

  const resetInput = () => {
    const initialData = STEP_INPUT_DATA[stepId];

    if (!stepId || !initialData) return;

    setInputData({ ...initialData, value: defaultValue || initialData.value });
    setSaveTapped(false);
  };

  useEffect(() => {
    resetInput();
  }, []);

  useEffect(() => {
    resetInput();
  }, [stepId]);

  const onChangeInput = (value: string) =>
    setInputData({ ...inputData, value });

  const isInputInvalid = () => !inputData.validator(inputData.value);

  const onTriggerSend = async () => {
    setSaveTapped(true);

    if (isInputInvalid()) return;

    try {
      const value = inputData.value;
      onChangeInput("");
      setSaveTapped(false);

      await onSend(value);
    } catch (err) {}
  };
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onTriggerSend();
    }
  }

  return inputData ? (
    <div className="dk-chat-row dk-chat-ic-m dk-chat-m-v-r dk-chat-p-h-s">
      <input
        value={inputData.value}
        placeholder={inputData.placeholder}
        type={inputData.type}
        onKeyDown={onKeyDown}
        onChange={(e) => onChangeInput(e.target.value)}
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
          "dk-chat-parent-height dk-chat-text-white dk-chat-fs-s-2 dk-chat-fw-m dk-chat-bg-blue"
        }
        style={{
          borderRadius: "0 4px 4px 0"
        }}
        onClick={onTriggerSend}
      />
    </div>
  ) : null;
}

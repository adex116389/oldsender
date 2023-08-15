import React, { ReactNode, useContext, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Button, Text, InputGroup } from "@chakra-ui/react";
import { FileContext } from "../context/fileContext";

type FileUploadProps = {
  register: UseFormRegisterReturn;
  error?: string;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
};

export const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple } = props;
  const { file, setFile } = useContext(FileContext) as FileType;

  const fileName = file.name;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick} mt={`16px`}>
      <input
        type={"file"}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        onChange={(e) => {
          const file: File = e.target.files?.item(0) as File;
          if (file) {
            ref(e.target);
            setFile(file);
          }
        }}
        ref={(e) => {
          inputRef.current = e;
        }}
      />
      <>
        <Button
          variant="outline"
          colorScheme="black"
          borderRadius={0}
          leftIcon={<Text as={`span`}>📁</Text>}
          fontWeight={`normal`}
          borderColor={props.error ? `crimson` : `black`}
          boxShadow={props.error ? `0 0 0 1px crimson` : `none`}
        >
          {!fileName ? "Select file" : fileName}
        </Button>
      </>
    </InputGroup>
  );
};

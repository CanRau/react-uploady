// @flow
import React, { forwardRef, memo, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { logger } from "@rpldy/shared";
import { UploadyContext, createContextApi } from "@rpldy/shared-ui";
import useUploader from "./useUploader";

import type { UploaderType } from "@rpldy/uploader";
import type { UploadyProps } from "./types";

type FileInputPortalProps = {|
    container: ?HTMLElement,
    uploader: UploaderType,
    multiple: boolean,
    capture: ?string,
    accept: ?string,
    webkitdirectory: ?boolean,
    style: Object,
|};

const FileInputFieldPortal = memo(forwardRef((props: FileInputPortalProps, ref) => {
    const { uploader, container, ...inputProps } = props;
    const instanceOptions = uploader.getOptions();

    return container ? ReactDOM.createPortal(<input
        {...inputProps}
        name={instanceOptions.inputFieldName}
        type="file"
        ref={ref}
    />, container) : null;
}));

const Uploady = (props: UploadyProps) => {
    const {
        multiple = true,
        capture,
        accept,
        webkitdirectory,
        listeners,
        debug,
        children,
        inputFieldContainer,
        customInput,
        ...uploadOptions
    } = props;

    logger.setDebug(!!debug);
    logger.debugLog("@@@@@@ Uploady Rendering @@@@@@", props);

    const container = inputFieldContainer || document.body;
    const internalInputFieldRef = useRef<?HTMLInputElement>();

    const uploader = useUploader(uploadOptions, listeners);

    const api = useMemo(() =>
             createContextApi(uploader, !customInput ? internalInputFieldRef : null),
        [uploader, internalInputFieldRef, customInput]
    );

    return <UploadyContext.Provider value={api}>
        {!customInput ? <FileInputFieldPortal
            container={container}
            uploader={uploader}
            multiple={multiple}
            capture={capture}
            accept={accept}
            webkitdirectory={webkitdirectory}
            style={{ display: "none" }}
            ref={internalInputFieldRef}
        /> : null}

        {children}
    </UploadyContext.Provider>;
};

export default Uploady;

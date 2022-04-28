import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashCan, faExternalLink, faPlay, faPause, faForward, faBackward, faSpinner, faDownload, faCloudArrowDown, faForwardStep, faBackwardStep } from "@fortawesome/free-solid-svg-icons";

library.add(
    faTrashCan,
    faExternalLink,
    faPlay, faPause,
    faForward, faBackward,
    faForwardStep, faBackwardStep,
    faSpinner, faDownload,
    faCloudArrowDown
);

export default FontAwesomeIcon;

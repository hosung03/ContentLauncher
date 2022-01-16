import { DisplayMode } from '../types';

export const DEFAULT_SCREEN_WIDTH: number = 1280;
export const DEFAULT_SCREEN_HEIGHT: number = 800;

// 서버의 재접속 대기시간이 10초인데 네트워크 전송 시간을 고려하여 설정한다.
export const NETWORK_DISCONNECT_WAITING_SEC: number = 20;

export const CONTENT_START_NORMAL_TYPE_LIMIT_MINUTE: number = 1;

export const LAZY_LOGIN_STUDENT_START_CONTENT_DEALY_SEC: number = 3;
export const CLASS_LIST_DISPLAY_CNT_PER_PAGE: number = 4;
export const STUDENT_LIST_DISPALY_CNT_PER_PAGE: number = 18;
export const BACKGROUND_IMAGE_DISPLAY_CNT_PER_PAGE: number = 9;
export const THREE_MIN_ACTIVITY_LIST_DISPLAY_CNT_PER_PAGE: number = 10;

export const STUDENT_RESULT_LIST_CNT_DISPLAY_CNT_PER_PAGE: number = 28;
export const STUDENT_RESULT_LIST_TEXT_DISPLAY_CNT_PER_PAGE: number = 28;
export const STUDENT_RESULT_LIST_IMAGE_DISPLAY_CNT_PER_PAGE: number = 15;
export const STUDENT_RESULT_LIST_AUDIO_DISPLAY_CNT_PER_PAGE: number = 15;
export const STUDENT_RESULT_LIST_VIDEO_DISPLAY_CNT_PER_PAGE: number = 15;

export const STUDENT_RESULT_LIST_BAR_TEXT_DISPLAY_CNT_PER_PAGE: number = 10;
export const STUDENT_RESULT_LIST_BAR_IMAGE_DISPLAY_CNT_PER_PAGE: number = 8;
export const STUDENT_RESULT_LIST_BAR_AUDIO_DISPLAY_CNT_PER_PAGE: number = 10;
export const STUDENT_RESULT_LIST_BAR_VIDEO_DISPLAY_CNT_PER_PAGE: number = 10;

export const BUTTON_SELECT_DISPLAY_MIL_SEC: number = 150;

export const TEACHER_FOLDER_NAME: string = 'teacher';
export const STUDENT_FOLDER_NAME: string = 'student';

export const CLASS_VIEW_MODE_1_VIEW: number = 1;
export const CLASS_VIEW_MODE_2_VIEW: number = 2;

export const MAX_STAMP_APPLY_CNT: number = 12;
export const ONE_SEC_BY_MILLISEC: number = 1000;

export const DEFAULT_DISPLAY_MODE: DisplayMode = DisplayMode.PROFILE_THUMB_N_NICKNAME;

export const INVALID_CURRICULUM_ID: number = 0;
export const EMPTY_STRING: string = '';

export const ClassSkinDataList = [
  { id: 1, thumbnail: 'images/bg_class.jpg' },
  { id: 2, thumbnail: 'images/bg/1.jpg' },
  { id: 3, thumbnail: 'images/bg/3.jpg' },
  { id: 4, thumbnail: 'images/bg/4.jpg' },
  { id: 5, thumbnail: 'images/bg/5.jpg' },
  { id: 6, thumbnail: 'images/bg/6.jpg' },
  { id: 7, thumbnail: 'images/bg/7.jpg' },
  { id: 8, thumbnail: 'images/bg/8.jpg' },
  { id: 9, thumbnail: 'images/bg/9.jpg' },
  { id: 10, thumbnail: 'images/bg/10.jpg' },
];

// Z-INDEX Order
export const Z_INDEX_TEACHING_TOOL_COMMON_RESULT_CNT_TYPE: number = 10;
export const Z_INDEX_TEACHING_TOOL_COMMON_RESULT_BAR: number = 10;
export const Z_INDEX_TEACHING_TOOL_COMMON_RESULT_LIST: number = 15;
export const Z_INDEX_TEACHING_TOOL_COMMON_RESULT_DETAIL: number = 16;
export const Z_INDEX_TEACHING_TOOL_COMMON_RESULT_STAMP_LIST: number = 17;
export const Z_INDEX_TEACHING_TOOL_COMMON_RESILT_STAMP: number = 18;
export const Z_INDEX_TEACHING_TOOL_TITLE_BAR: number = 20;
export const Z_INDEX_TEACHING_TOOL_COMMON_RESULT_LIST_DETAIL: number = 25;
export const Z_INDEX_TEACHING_TOOL_MENU_ITEM: number = 100;
export const Z_INDEX_TEACHING_TOOL_MENU_ITEM_POPUP: number = 200;
export const Z_INDEX_TEACHING_TOOL_MENU_ITEM_POPUP_PLUS1: number = 99999;
export const Z_INDEX_TEACHING_TOOL_MENU_ITEM_POPUP_STAMP: number = 100000;
export const Z_INDEX_TEACHING_TOOL_MEMU_BAR: number = 150;
export const Z_INDEX_LESSON_COMPLETE_POPUP: number = 200;

// History
export const SKETCH_HISTORY_TEACHER_DRAWING_BASIC = 'teacher-sketch1';
export const SKETCH_HISTORY_TEACHER_DRAWING_LINEBOARD = 'teacher-sketch2';
export const SKETCH_HISTORY_TEACHER_DRAWING_WHITEBOARD = 'teacher-sketch3';
export const SKETCH_HISTORY_TEACHER_DRAWING_IMAGEBOARD = 'teacher-sketch4';
export const SKETCH_HISTORY_TEACHER_DRAWING_SQUAREBOARD = 'teacher-sketch5';
export const SKETCH_HISTORY_TEACHER_DRAWING_FOURLINEBOARD = 'teacher-sketch6';
export const SKETCH_HISTORY_TEACHER_DRAWING_FOURLINETRACEBOARD = 'teacher-sketch7';
export const SKETCH_HISTORY_TEACHER_DRAWING_CROP_RESULT = 'teacher-sketch8';
export const SKETCH_HISTORY_TEACHER_DRAWING_LIBRARY = 'teacher-sketch9';

// Crop box minimum size
export const CROP_MINIMUM_WIDTH: number = 193;
export const CROP_MINIMUM_HEIGHT: number = 193;

// 런처-참여수업 커스텀 토픽
export const IO_TOPIC_MAX_LENGTH: number = 70;

// 런처-기본이미지(남/여, 클래스) - KimCG Updated 2019.02.11
export const DEFAULT_MAN_IMAGE: string = 'images/default_member_m.jpg';
export const DEFAULT_WOMAN_IMAGE: string = 'images/default_member_w.jpg';
export const DEFAULT_CLASS_IMAGE: string = 'images/default_course.jpg';

// 도메인 디폴트
// export const DEFAULT_API_DOMAIN: string = 'http://api.fel40.com';
// export const DEFAULT_S3_BUCKET_DOMAIN: string = 'https://s3.ap-northeast-2.amazonaws.com/primaryenglisheyecontents';

export enum ExtraBookType {
  LOWER     = 'B61001',
  UPPER     = 'B61002',
  SONG      = 'B61003',
  ACTIVITY  = 'B61004',
}

export const BOOK_VERSION_JSON_FILE_NAME = 'BookVersion.json';

export const RESOURCE_RELOAD_MAX_STANDBY_SEC = 15;
export const STUDENT_PORTFOLUI_MAX_STANDBY_SEC = 10;

export const PAD_VIDEO_MINE_TYPE = 'video/mp4';

export const INIT_FLOATING_PEN_TOOL_POS = { x: 100, y: 100 };

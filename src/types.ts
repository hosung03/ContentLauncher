export const enum SubjectType {
  NONE = '',
  ENGLISH = 'E',
  MATHEMATICS = 'M',
  KOREAN = 'K',
}

export const enum UserDiv {
  NONE = '',
  TEACHER = 'T',
  STUDENT = 'S',
  ASSITANCE = 'A',
  MANAGER = 'M'
}

export const enum Gender {
  MALE = 'M',
  FEMALE = 'F'
}

export const enum ClassColorType {
  WHITE = 'White',
  BLACK = 'Black'
}
export interface MemberDataType {
  id: number;
  userDiv: UserDiv;
  name: string;
  nickName: string;
  gender: string;
  birthday: string;
  thumbnail: string;
  defaultThumbnail: string;
  profileThumbnail: string;
  displayMode: number;
}

export const enum AccountState {
  INVALID,
  IN_CLASS,
  OUT_CLASS,
  LOGOUT,
  DISCONNECT,
}

export interface AccountProfileType {
  sessionId: string;
  id: number;
  userDiv: UserDiv;
  name: string;
  nickName: string;
  thumbnail: string;
  defaultThumbnail: string;
  profileThumbnail: string;
  birthday: string;
  gender: string;
  displayMode: number;
}

export interface StateChangedType {
  type: AccountState;
  data: AccountProfileType;
}

export enum DisplayMode {
  DEFAULT_THUMB_N_NAME = 0,
  PROFILE_THUMB_N_NICKNAME,
}

export interface ClassStudyType {
  orderSeq: number;
  startDate: string;
  endDate: string;
}

export interface LiveClassesType {
  classid: number;
  name: string;
  viewType: number;
  tch_idx: number;
  isLive: boolean;
  product: ProductType;
}

export interface ProductType {
  id: number;
  name: string;
  period: number;
  curriculumImage: string;
  curriculumId: number;
  curriculumColor: string;
  description: string;
}

export interface ClassesType {
  id: number;
  name: string;
  memberCount: number;
  study: ClassStudyType;
  product: ProductType;
}

export enum Completed {
  NOT_COMPLETED = 0,
  COMPLETED
}

export interface StudyResultClassType {
  clsStdIdx: number;
  curiBkIdx: number;
  completed: Completed;
  startTime: number;
  endTime: number;
}

export interface CurriculumBookType {
  id: number;
  path: string;
  viewMode: number;
  key: number;
  cmsKey: number;
  updatetime: string;
  completed: Completed;
  studyResultClass?: StudyResultClassType;
}

export interface CurriculumType {
  id: number;
  code: string;
  depth: number;
  depth_name: string;
  info: string;
  div: string;
	subDiv: string;
  name: string;
  thumbnail: string;
  childrenList: CurriculumType[];
  book?: CurriculumBookType;
}

export interface ExtraActivityType {
  id: number;
  type: string;
  name: string;
  thumbnail: string;
  order: number;
  book: CurriculumBookType;
}

export interface ClassSettingItemFile {
  classSettingsIdx: string;
  filePath: string;
  orderNum: string;
  selected: string;
}

export interface ClassSettingItem {
  groupNm: string;
  code: string;
  useYn: string;
  groupCd: string;
  classSettingsIdx?: string;
  files?: ClassSettingItemFile[];
}

export interface ClasSettingSessionStorage {
  lessonMode: string;
  teacherSetting: string;
  studentSetting: string;
  selectedBgId: string;
  selectedBgImg: string;
  enddate: number;
}

export interface DeviceInfo {
  soundid: string;
  videoid: string;
  speakerid: string;
}

export interface SwiperWrapperType {
  swiper: SwiperInterface;
}

export interface SwiperInterface {
  activeIndex: number;
  realIndex: number;
  slideNext: (speed?: number) => void;
  slidePrev: (speed?: number) => void;
  slideTo: (index: number, speed?: number) => void;
  update: () => void;
  updateSlides: () => void;
  params: {
    speed: number;
  };
  scrollbar: {
    updateSize: () => void;
  };

  allowSlideNext: boolean;
  allowSlidePrev: boolean;
  allowTouchMove: boolean;
  isEnd: boolean;
  slides: Array<HTMLElement>;
}

type PlayOptionType = {
  audioIndex: number;
  loop?: boolean;
  playEndedCallback?: () => void;
};

type AudioEventType = {
  index: number;
  ended: () => void;
};

export enum EffectSoundType {
  INVALID = 0,
  COMMON_ARROW_DOWN,
  COMMON_ARROW_UP,
  COMMON_ROULETTE,
  PRESENTER_STUDENT_PICKED,
  GROUP_STUDENT_PICKED,
  TIMER_LITTLE_REMAIN,
  TIMER_FINISH,
  STAMP_TEACHER,
  STAMP_STUDENT,
  STAMP_TROPHY,
  COMMON_ARROW_CLASSUNIT_SELECT,
  COMMON_TEACHINGTOOL_CLICK,
  COMMON_SUBMIT_RESULT_MOVE,
  COMMON_BUTTON_BACK_CLICK,
}

const SoundEffectResList = [
  // 공통_화살표_내리기_전자칠판.mp3
  { type: EffectSoundType.COMMON_ARROW_DOWN, res: 'sounds/common_arrow_down.mp3' },
  // 공통_화살표_올리기_학생PAD.mp3
  { type: EffectSoundType.COMMON_ARROW_UP, res: 'sounds/common_arrow_up.mp3' },
  // 룰렛 돌아가는 소리
  { type: EffectSoundType.COMMON_ROULETTE, res: 'sounds/common_roulette.ogg' },
  // 발표자 선정된 학생에게 출력되는 사운드
  { type: EffectSoundType.PRESENTER_STUDENT_PICKED, res: 'sounds/common_roulette.mp3' }, // 키콘에서 수정한 코드 통합하기 전 임시 조치 (ogg->mp3)
  // 그룹 결정 학생 사운드
  { type: EffectSoundType.GROUP_STUDENT_PICKED, res: 'sounds/group_student_picked.mp3' },
  // 타이머 4초 남았을 때
  { type: EffectSoundType.TIMER_LITTLE_REMAIN, res: 'sounds/timer_little_remain.ogg' },
  { type: EffectSoundType.TIMER_FINISH, res: 'sounds/timer_FINISH.ogg' },
  { type: EffectSoundType.STAMP_TEACHER, res: 'sounds/stamp/stamp_teacher.wav' },
  { type: EffectSoundType.STAMP_STUDENT, res: 'sounds/stamp/stamp_student.ogg' },
  { type: EffectSoundType.STAMP_TROPHY, res: 'sounds/stamp/stamp_trophy.mp3' },
  // 공통_화살표_클래스,유닛선택_전자칠판.mp3
  { type: EffectSoundType.COMMON_ARROW_CLASSUNIT_SELECT, res: 'sounds/common_arrow_classunit_select.mp3' },
  { type: EffectSoundType.COMMON_TEACHINGTOOL_CLICK, res: 'sounds/common_teachingtool_click.mp3' },
  // 학생제출내역이동
  { type: EffectSoundType.COMMON_SUBMIT_RESULT_MOVE, res: 'sounds/common_page_move.mp3' },
  // 뒤로가기 버튼 클릭
  { type: EffectSoundType.COMMON_BUTTON_BACK_CLICK, res: 'sounds/btn_back.mp3' },
];

class SoundPlayManager {
  private effAudioList: Array<HTMLAudioElement> = [];
  private effAudioEventList: Array<AudioEventType> = [];
  private eff1Audio: HTMLAudioElement|null = null;
  private isMutedEffect: boolean = false;

  constructor() {
    this.preloadResource();
    this.effAudioList = [];
    this.effAudioEventList = [];
    this.isMutedEffect = false;
  }

  public setAudioElement(eff1Audio: HTMLAudioElement, eff2Audio: HTMLAudioElement) {
    this.effAudioList[0] = eff1Audio;
    this.effAudioList[1] = eff2Audio;
    this.eff1Audio = eff1Audio;
  }

  public stopAllEffect() {
    this.effAudioList.forEach((audio, index) => {
      this.stopEffect(index);
    });
  }

  public pauseEffect(index: number) {
    const audio = this.effAudioList[index];
    if (audio && !audio.paused) audio.pause();
  }

  // 선택한 Audio 파일만 다시 재생한다.
  public resumeEffect(index: number) {
    const audio = this.effAudioList[index];
    if (audio && audio.paused) audio.play();
  }

  public playEffect(effectType: number, opt?: PlayOptionType) {
    const soundRes = SoundEffectResList.find(item => item.type === effectType);
    if (!soundRes) {
      console.log('not exist sound. type:', effectType);
      return;
    }

    const audioIndex = opt ? opt.audioIndex : 0;
    let curAudio = this.effAudioList[audioIndex];
    if (!curAudio) {
      curAudio = this.effAudioList[0];
      console.error(`mismatch use AudioList audioIndex: ${audioIndex}`);
    }

    if (!curAudio.paused) curAudio.pause();
    this.stopEffect(audioIndex);

    curAudio.src = soundRes.res;
    curAudio.loop = false;
    curAudio.muted = this.isMutedEffect;

    const callback = () => {
      if (opt && opt.playEndedCallback) opt.playEndedCallback();
      curAudio.removeEventListener('ended', callback);
    };

    if (opt && opt.loop) curAudio.loop = opt.loop;

    const audioEvt = { index: audioIndex, ended: callback };
    const foundEvtIndex = this.effAudioEventList.findIndex(item => item.index === audioIndex);
    if (foundEvtIndex !== -1) {
      this.effAudioEventList[foundEvtIndex] = audioEvt;
    } else {
      this.effAudioEventList.push(audioEvt);
    }

    curAudio.addEventListener('ended', callback);
    curAudio.oncanplaythrough = () => {
      curAudio.play();
    };
  }

  public setEffectMuted(isMuted: boolean) {
    this.isMutedEffect = isMuted;
    if(this.eff1Audio) this.eff1Audio.muted = isMuted;
  }

  public stopEffect(index: number = 0) {
    const audio: HTMLAudioElement = this.effAudioList[index];
    if (audio && !audio.paused) audio.pause();

    const foundEvtIndex = this.effAudioEventList.findIndex(item => item.index === index);
    if (foundEvtIndex !== -1) {
      audio.removeEventListener('ended', this.effAudioEventList[foundEvtIndex].ended);
      this.effAudioEventList.splice(foundEvtIndex, 1);
    }
  }

  private preloadResource() {
    // 추후 리소스 Preload가 필요한 경우 제어한다.
  }
}

const soundService = new SoundPlayManager();
export default soundService;

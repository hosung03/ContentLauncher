import * as React from 'react';
import soundPlayManager from '../manager/SoundPlayManager';

interface SoundProps {}
interface SoundState {}
class Sound extends React.Component<SoundProps, SoundState> {
  private bgmAudio: HTMLAudioElement|undefined = undefined;
  private eff1Audio: HTMLAudioElement|undefined = undefined;
  private eff2Audio: HTMLAudioElement|undefined = undefined;

  componentDidMount() {
    if(this.eff1Audio && this.eff2Audio) soundPlayManager.setAudioElement(this.eff1Audio, this.eff2Audio);
  }

  render() {
    return (
      <div>
        <audio
          data-audio={'audio01'}
          ref={audio => {
            if (audio) this.bgmAudio = audio;
          }}
        ></audio>
        <audio
          data-audio={'audio02'}
          ref={audio => {
            if (audio) this.eff1Audio = audio;
          }}
        ></audio>
        <audio
          data-audio={'audio03'}
          ref={audio => {
            if (audio) this.eff2Audio = audio;
          }}
        ></audio>
      </div>
    );
  }
}

export default Sound;

import { observable } from 'mobx';
import * as React from 'react';
import { ExtraActivityType} from '../../types';

export interface IThreeMinSlideItem {
  curActivity: ExtraActivityType;
  onClickActivity: (id: number) => void;
}

export default class ThreeMinSlideItem extends React.Component<IThreeMinSlideItem> {
  constructor(props: IThreeMinSlideItem) {
    super(props);

  }

  onClickItem = () => {
    const { curActivity, onClickActivity } = this.props;
    onClickActivity(curActivity.book.id);
  };

  render() {
    const { curActivity } = this.props;
    
    let thumbnail = '';
    if(curActivity) thumbnail = curActivity.thumbnail;

    return (
      <li>
        <p onClick={this.onClickItem}>
          <img src={curActivity.thumbnail} />
        </p>
        <div>
          <div>{curActivity.name}</div>
        </div>
      </li>
    );
  }
}

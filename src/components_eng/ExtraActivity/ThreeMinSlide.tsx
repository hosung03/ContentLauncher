import * as React from 'react';
import ThreeMinSlideItem from './ThreeMinSlideItem';
import { ExtraActivityType } from '../../types';

export interface IThreeMinSlide {
  activityList: Array<ExtraActivityType>;
  onClickActivity: (id: number) => void;
}

export default class ThreeMinSlide extends React.Component<IThreeMinSlide> {
  render() {
    const { activityList, onClickActivity} = this.props;
    return (
      <>
        {activityList.map((curActivity: ExtraActivityType, index: number) => {
          return (
            <ThreeMinSlideItem
              key={curActivity.id}
              curActivity={curActivity}
              onClickActivity={onClickActivity}
            />
          );
        })}
      </>
    );
  }
}

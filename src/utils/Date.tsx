import * as React from 'react';
import * as moment from 'moment';

export interface DateProps {}
export interface DateState {
  curDate: string;
}

export default class Date extends React.Component<DateProps, DateState> {
  timerInterval: number = 0;

  constructor(props: DateProps) {
    super(props);

    this.state = { curDate: this.getFormattedTime() };
  }

  componentDidMount() {
    this.timerInterval = window.setInterval(this.updateTime.bind(this), 1000);
    this.updateTime();
  }

  componentWillUnmount() {
    if (this.timerInterval) window.clearInterval(this.timerInterval);
  }

  updateTime() {
    this.setState({ curDate: this.getFormattedTime() });
  }

  getFormattedTime() {
    return moment().format('ddd MM.DD HH:mm'); // #kor 20181123 신진범
  }

  render() {
    const { curDate } = this.state;
    return <span className="date">{curDate}</span>;
  }
}

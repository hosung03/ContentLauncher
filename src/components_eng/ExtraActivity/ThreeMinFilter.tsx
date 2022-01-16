import * as React from 'react';

export enum FilterType {
  ALL,
  LOWER,
  UPPER,
}

interface ThreeMinFilterProps {
  curFilterType: FilterType;
  onUpdateFilter(filterType: FilterType): void;
}

const ThreeMinFilter: React.SFC<ThreeMinFilterProps> = ({ curFilterType, onUpdateFilter }) => {
  const updateFilter = (filterType: FilterType) => onUpdateFilter(filterType);
  const handleClickAll = () => updateFilter(FilterType.ALL);
  const handleClickLower = () => updateFilter(FilterType.LOWER);
  const handleClickUpper = () => updateFilter(FilterType.UPPER);

  return (
    <div className="type_filter">
      <b className={curFilterType === FilterType.ALL ? 'select' : undefined} onClick={handleClickAll}>
        ALL
      </b>
      <b className={curFilterType === FilterType.LOWER ? 'select' : undefined} onClick={handleClickLower}>
        LOWER
      </b>
      <b className={curFilterType === FilterType.UPPER ? 'select' : undefined} onClick={handleClickUpper}>
        UPPER
      </b>
    </div>
  );
};

export default ThreeMinFilter;

import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import {bem} from 'js/bem';
import KoboDropdown, {KOBO_DROPDOWN_THEMES} from 'js/components/common/koboDropdown';
import {SORT_VALUES} from 'js/components/submissions/tableConstants';
import './tableColumnSortDropdown.scss';

const CLEAR_BUTTON_CLASS_NAME = 'table-column-sort-dropdown-clear';

/**
 * A wrapper around KoboDropdown to be used in table header to sort columns.
 *
 * @prop {string} fieldId - one of table columns
 * @prop {string|null} sortValue
 * @prop {function} onSortChange
 * @prop {function} onHide
 * @prop {boolean} isFieldFrozen
 * @prop {function} onFrozenChange
 * @prop {Node} [additionalTriggerContent] - to be put inside trigger, before the predefined content. Please note that the trigger as a whole is clickable, so this additional content would need stopPropagation to be clickable.
 */
class TableColumnSortDropdown extends React.Component {
  constructor(props){
    super(props);
    autoBind(this);
  }

  renderTrigger() {
    let sortIcon = ['k-icon'];
    if (this.props.sortValue && this.props.sortValue === SORT_VALUES.A_TO_Z) {
      sortIcon.push('k-icon-sort-down');
    }
    if (this.props.sortValue && this.props.sortValue === SORT_VALUES.Z_TO_A) {
      sortIcon.push('k-icon-sort-up');
    }

    return (
      <div className='table-column-sort-dropdown-trigger'>
        {this.props.additionalTriggerContent}
        {this.props.sortValue &&
          <i className={sortIcon.join(' ')}/>
        }
        <i className='k-icon k-icon-caret-up'/>
        <i className='k-icon k-icon-caret-down'/>
      </div>
    );
  }

  clearSort() {
    this.props.onSortChange(this.props.fieldId, null);
  }

  changeSort(sortValue, evt) {
    // When clicking on clear icon button, we need to avoid triggering also the
    // change sort button. We can't use `stopPropagation` on `clearSort` as it
    // breaks `onMenuClick` functionality.
    if (evt?.target?.classList?.contains(CLEAR_BUTTON_CLASS_NAME)) {
      return;
    }
    this.props.onSortChange(this.props.fieldId, sortValue);
  }

  hideField() {
    this.props.onHide(this.props.fieldId);
  }

  changeFieldFrozen(isFrozen) {
    this.props.onFrozenChange(this.props.fieldId, isFrozen);
  }

  renderSortButton(buttonSortValue) {
    return (
      <bem.KoboDropdown__menuButton
        className={classNames('table-column-sort-dropdown-option', {
          'table-column-sort-dropdown-option--active': this.props.sortValue === buttonSortValue,
        })}
        onClick={this.changeSort.bind(this, buttonSortValue)}
      >
        {buttonSortValue === SORT_VALUES.A_TO_Z && [
          <i key='0' className='k-icon k-icon-sort-down'/>,
          <span key='1'>{t('Sort A → Z')}</span>,
        ]}
        {buttonSortValue === SORT_VALUES.Z_TO_A && [
          <i key='0' className='k-icon k-icon-sort-up'/>,
          <span key='1'>{t('Sort A → Z')}</span>,
        ]}

        {this.props.sortValue === buttonSortValue &&
          <i
            onClick={this.clearSort}
            className={classNames('k-icon', 'k-icon-close', CLEAR_BUTTON_CLASS_NAME)}
          />
        }
      </bem.KoboDropdown__menuButton>
    );
  }

  render() {
    return (
      <KoboDropdown
        theme={KOBO_DROPDOWN_THEMES.dark}
        hideOnEsc
        hideOnMenuClick
        hideOnMenuOutsideClick
        name='table-column-sort'
        triggerContent={this.renderTrigger()}
        menuContent={
          <React.Fragment>
            {this.renderSortButton(SORT_VALUES.A_TO_Z)}
            {this.renderSortButton(SORT_VALUES.Z_TO_A)}

            <bem.KoboDropdown__menuButton onClick={this.hideField}>
              <i className='k-icon k-icon-hide'/>
              <span>{t('Hide field')}</span>
            </bem.KoboDropdown__menuButton>

            <bem.KoboDropdown__menuButton
              onClick={this.changeFieldFrozen.bind(this, !this.props.isFieldFrozen)}
            >
              {this.props.isFieldFrozen && [
                <i key='0' className='k-icon k-icon-unfreeze'/>,
                <span key='1'>{t('Unfreeze field')}</span>,
              ]}
              {!this.props.isFieldFrozen && [
                <i key='0' className='k-icon k-icon-freeze'/>,
                <span key='1'>{t('Freeze field')}</span>,
              ]}
            </bem.KoboDropdown__menuButton>
          </React.Fragment>
        }
      />
    );
  }
}

export default TableColumnSortDropdown;
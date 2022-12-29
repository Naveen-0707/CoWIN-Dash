import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersJob = props => {
  const renderSalaryList = () => {
    const {salaryOptions} = props

    return salaryOptions.map(each => {
      const {changeSalaryby} = props
      const onClickSalaryItem = () => changeSalaryby(each.salaryRangeId)
      return (
        <li key={each.salaryRangeId} onClick={onClickSalaryItem}>
          <input
            type="radio"
            id={each.salaryRangeId}
            name="salary"
            value={each.salaryRangeId}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
          <br />
        </li>
      )
    })
  }
  const renderTypeList = () => {
    const {typeOptions, activeTypeIds} = props

    return typeOptions.map(each => {
      const {changeType} = props
      const typeList = activeTypeIds
      const onClickTypeItem = event => {
        if (event.target.checked) {
          typeList.push(event.target.value)
          changeType(typeList)
        } else {
          const typeList1 = typeList.filter(eachType => {
            if (eachType !== event.target.value) {
              return eachType
            }
            return null
          })
          changeType(typeList1)
        }
      }

      return (
        <li key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            name={each.label}
            value={each.employmentTypeId}
            onClick={onClickTypeItem}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
          <br />
        </li>
      )
    })
  }

  const renderSalaryRange = () => (
    <>
      <h1>Salary Range</h1>
      <ul>{renderSalaryList()}</ul>
    </>
  )

  const renderJobType = () => (
    <>
      <h1>Type of Employment</h1>
      <ul>{renderTypeList()}</ul>
    </>
  )

  const searchClicked = () => {
    const {enterSearchInput} = props
    enterSearchInput()
  }

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => {
    const {searchInput} = props
    return (
      <div>
        <input
          value={searchInput}
          type="search"
          placeholder="Search"
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button testid="searchButton" onClick={searchClicked} type="button">
          <BsSearch />
        </button>
      </div>
    )
  }

  return (
    <div>
      {renderSearchInput()}
      {renderJobType()}
      {renderSalaryRange()}
    </div>
  )
}

export default FiltersJob

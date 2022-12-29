import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import FiltersJob from '../FiltersJob'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobList: [],
    profileData: {},
    apiStatus: apiStatusConstants.initial,
    apiStatusP: apiStatusConstants.initial,
    activeSalaryId: '',
    activeTypeIds: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatusP: apiStatusConstants.inProgress})
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    try {
      const response = await fetch(profileApiUrl, options)
      const fetchedProfileData = await response.json()
      const profile = fetchedProfileData.profile_details
      const profileData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({profileData, apiStatusP: apiStatusConstants.success})
    } catch (error) {
      this.setState({apiStatusP: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeSalaryId, activeTypeIds, searchInput} = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeTypeIds}&minimum_package=${activeSalaryId}&search=${searchInput}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } catch (error) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {profileData} = this.state

    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-view">
        <img alt="profile" className="profile-image" src={profileImageUrl} />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-para">{shortBio}</p>
      </div>
    )
  }

  renderProfile = () => {
    const {apiStatusP} = this.state
    switch (apiStatusP) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureViewP()
      default:
        return null
    }
  }

  changeSalaryby = activeSalaryId => {
    this.setState({activeSalaryId}, this.getJobs)
    console.log(activeSalaryId)
  }

  changeType = activeTypeIds => {
    this.setState({activeTypeIds}, this.getJobs)
    console.log(activeTypeIds)
  }

  enterSearchInput = () => this.getJobs()

  changeSearchInput = searchInput => {
    this.setState({searchInput})
    console.log(searchInput)
  }

  profileRetry = () => this.getProfile()

  jobRetry = () => this.getJobs()

  renderFailureViewP = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.profileRetry}>
        Retry
      </button>
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.jobRetry}>
        Retry
      </button>
    </div>
  )

  renderjobListView = () => {
    const {jobList} = this.state
    console.log(jobList)
    const shouldShowjobList = jobList.length > 0

    return shouldShowjobList ? (
      <div>
        <ul>
          {jobList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderjobListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeTypeIds, searchInput, activeSalaryId} = this.state

    return (
      <div>
        <Header />
        {this.renderProfile()}
        <FiltersJob
          searchInput={searchInput}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          typeOptions={employmentTypesList}
          salaryOptions={salaryRangesList}
          activeTypeIds={activeTypeIds}
          activeSalaryId={activeSalaryId}
          changeType={this.changeType}
          changeSalaryby={this.changeSalaryby}
        />
        {this.renderAllJobs()}
      </div>
    )
  }
}

export default Jobs

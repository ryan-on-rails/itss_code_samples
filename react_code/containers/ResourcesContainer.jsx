import React, { PropTypes }  from 'react'
import { connect }           from 'react-redux'
import Fuse                  from 'fuse.js'
import Resources             from '../components/dashboard/Resources'
import * as ResourcesActions from '../actions/ResourcesActions'

class ResourcesContainer extends React.Component {
  constructor(props) {
    super(props)

    this.handleSearchResources       = this.handleSearchResources.bind(this)
    this.handleFilterLessonResources = this.handleFilterLessonResources.bind(this)
    this.handleFilterTypeResources   = this.handleFilterTypeResources.bind(this)
  }

  componentDidMount() {
    this.props.requestResources()
  }

 /* extract a list of lessons for which there are resources */
  lessonsList() {
   return this.props.lessons.map(lesson => {
     return { id: lesson.id, title: lesson.title }
   })
  }

 /* filteredResources
  *   narrows down the resources to be displayed by applying the
  *   studentsSearchFilter and then sorts them by the studentsSortFilter
  */
  filteredResources() {
    let resources = this.props.lessons

    // filters the resources by lesson id and extract the files
    if ( this.props.lessonFilter === 'all' ) {
      resources = resources.reduce((resource_list, resource) => {
        return resource_list.concat(resource.resources)
      }, [])
    } else {
      resources = resources.find(resource => {
        return resource.id === parseInt(this.props.lessonFilter, 10)
      }).resources
    }

    // convert the list of files into a searchable Fuse object
    resources = new Fuse(resources,
                         { keys: ['file_name'] })

    // apply the search filter if there is any
    if (this.props.searchFilter === '') {
      resources = resources.list
    } else {
      resources = resources.search(this.props.searchFilter)
    }

    var reg = new RegExp(this.props.fileTypeFilter);
    // finally, filter files by their type
    if ( this.props.fileTypeFilter === 'all' ) {
      // do nothing, keep resources as is
    } else {
      resources = resources.filter(resource => {
        return reg.test(resource.file_type);
      })
    }

    return resources
  }

  handleSearchResources(event) {
    event.preventDefault()
    const query = $('#search-resources [name=search]').val()
    this.props.searchResources(query)
  }

  handleFilterLessonResources(event) {
    const lesson = event.target.value
    this.props.filterLessonResources(lesson)
  }

  handleFilterTypeResources(event) {
    const fileType = event.target.value
    this.props.filterTypeResources(fileType)
  }

  render() {
    return (
      <Resources
        contentLoading={this.props.contentLoading}
        onSearchResources={this.handleSearchResources}
        onFilterLessonResources={this.handleFilterLessonResources}
        onFilterTypeResources={this.handleFilterTypeResources}
        classroom={this.props.classroom}
        lessons={this.lessonsList()}
        resources={this.filteredResources()} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    contentLoading: state.contentLoading,
    classroom:      state.user.classroom_id,
    lessons:        state.dashboard.resources.lessons,
    lessonFilter:   state.dashboard.resources.lessonFilter,
    fileTypeFilter: state.dashboard.resources.fileTypeFilter,
    searchFilter:   state.dashboard.resources.searchFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestResources: () => {
      dispatch(ResourcesActions.requestResources())
    },
    filterLessonResources: (lesson) => {
      dispatch(ResourcesActions.filterLessonResources(lesson))
    },
    filterTypeResources: (fileType) => {
      dispatch(ResourcesActions.filterTypeResources(fileType))
    },
    searchResources: (query) => {
      dispatch(ResourcesActions.searchResources(query))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesContainer)

import React, { PropTypes } from 'react'
import { Link }             from 'react-router'
import LoadingOverlay       from '../LoadingOverlay'

class Resources extends React.Component {
  static propTypes = {
    onSearchResources:       PropTypes.func.isRequired,
    onFilterLessonResources: PropTypes.func.isRequired,
    onFilterTypeResources:   PropTypes.func.isRequired,
    classroom: PropTypes.number.isRequired,
    lessons:   PropTypes.array.isRequired,
    resources: PropTypes.array.isRequired
  }

  render() {
    return (
      <div className='itss-dashboard-resources'>
        <header className='classroom-status-header'>
          <h1 className='classroom-status-name'>
            <Link to='/dashboard'>
              <span className='title-inactive'>
                Classroom {this.props.classroom}
              </span>
            </Link>
            <span className='title-divider'>/</span>
            Resources
          </h1>
          <ul className='classroom-status-utilities'>
            <li>
              <Link to='/dashboard'>
                <button
                  type='button'
                  className='btn-dashboard btn-gold classroom-status-utility'>
                  Student Status Table
                </button>
              </Link>
            </li>
          </ul>
          <div className='clearfix'></div>
        </header>
        <main className='dashboard-body'>
          <div className='itss-dashboard-resources'>
            <form
              id='search-resources'
              onSubmit={this.props.onSearchResources}>
              <label className='sr-only'>Search Resources</label>
              <input name='search' className='form-control' placeholder='Search Resources' />
              <button type='button' className='btn-dashboard btn-red-orange' onClick={this.props.onSearchResources}>
                <span className='fa fa-search' aria-hidden='true'></span>
                <span className='sr-only'>Search</span>
              </button>
              <label className='sr-only'>Lesson</label>
              <div className='custom-select custom-select-turq resource-lesson'>
                <select
                  onChange={this.props.onFilterLessonResources}
                  defaultValue=''
                  name='lesson'>
                  <option disabled value=''>Lesson</option>
                  <option value='all'>All Lessons</option>
                  {this.props.lessons.map(lesson => {
                    return (
                      <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    )
                  })}
                </select>
                <span className='custom-select-arrow' aria-hidden='true'>▼</span>
              </div>
              <label className='sr-only'>File Type</label>
              <div className='custom-select custom-select-turq resource-file-type'>
                <select
                  onChange={this.props.onFilterTypeResources}
                  defaultValue=''
                  name='file-type'>
                  <option disabled value=''>File Type</option>
                  <option value='all'>All File Types</option>
                  <option value='audio'>Audio</option>
                  <option value='document'>Document</option>
                  <option value='image'>Image</option>
                  <option value='pdf'>PDF</option>
                  <option value='text'>Text</option>
                  <option value='video'>Video</option>
                </select>
                <span className='custom-select-arrow' aria-hidden='true'>▼</span>
              </div>
            </form>
            <h2 className='downloads-header'>Downloads:</h2>
            <ul className='resources'>
              {this.props.resources.map(resource => {
                var type = "";
                var doc_reg = new RegExp("document");
                var pdf_reg = new RegExp("pdf");

                if(pdf_reg.test(resource.file_type)){
                  type = "PDF";
                }else if(doc_reg.test(resource.file_type)){
                  type = "Document";
                }else{
                  type = resource.file_type;
                }

                return (
                  <li key={resource.id} className='resource'>
                    <div className='file-type'>
                      {type}
                    </div>
                    <div className='filename'>
                      {resource.file_name}
                    </div>
                    <div className='download'>
                      <a href={resource.url} download target='_blank'>
                        <span className="fa fa-arrow-down" aria-hidden="true"></span>
                        Download
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </main>
        <LoadingOverlay loading={this.props.contentLoading}>
          <span>Fetching Classroom Resources...</span>
        </LoadingOverlay>
      </div>
    )
  }
}

export default Resources

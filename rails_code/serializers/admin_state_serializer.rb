class AdminStateSerializer < ActiveModel::Serializer
  attributes :course_list, :user, :lesson

  has_many :articles
  has_many :feedbacks
  has_many :schools

  # Course list
  def course_list
    if object.admin?
      Course.all.order(:id).map { |c|
        BaseCourseSerializer.new(c, scope: object)
      }
    else
      []
    end
  end

  def user
    UserSerializer.new(object, scope: object)
  end
  def lesson
    LessonSerializer.new(Lesson.new, scope: object)
  end
  def articles
    Article.all.order(:en_title).map { |article| BaseArticleSerializer.new(article) }    
  end
  def feedbacks
    Feedback.all.order(:slug)#.map{ |fb| BaseFeedbackSerializer.new(fb) }   
  end
  def schools
    schools = School.all.includes(:classrooms).order(:name)#.to_a
    #schools.push(School.new(id: -1, name: "Other"))
    schools.map{ |school| BaseSchoolSerializer.new(school) }  
  end
end

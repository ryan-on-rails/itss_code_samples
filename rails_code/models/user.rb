class User < ActiveRecord::Base
  #establish_connection DMZ_CONF
  include Devise::Models::DatabaseAuthenticatable
  devise :rememberable, :trackable, :cas_authenticatable
  has_paper_trail
  acts_as_paranoid

  belongs_to :classroom
  has_many :observations
  #validates_presence_of :current_activity

  has_many :user_languages
  has_many :languages, through: :user_languages

  # NOTE: CAS authenticatable does not trigger
  # subclass callbacks on (at least) create.
  before_create :set_student_defaults

  # NOTE: This resets the user to previous activity if they log out when on a recall activity
  Warden::Manager.before_logout do |user, auth, opts|
    if user.type == "Student" && user.current_activity.category == "Recall"
      current_activity_index = user.current_lesson.activities.index(user.current_activity)
      if current_activity_index > 0
        previous_activity = user.current_lesson.activities[current_activity_index-1]
        user.update(current_activity: previous_activity)
      end
    end
  end

  ##
  # Serialize the user information
  def serialize!
    UserSerializer.new(self)
  end

  ##
  # Can the user actually use the application
  def is_supported?
    false
  end

  ##
  # Checks if user is an administrator
  def admin?
    self.is_a?(Administrator) || self.administrator
  end

  ##
  # Returns full name from database
  def full_name
    "#{first_name} #{last_name}"
  end

  ##
  # Wrapped method to test if user is a student
  def student?
    self.is_a?(Student)
  end

  ##
  # Wrapped method to test if user is a teacher
  def teacher?
    self.is_a?(Teacher)
  end

  ##
  # Wrapped method to test if user is a teacher
  def admin_or_teacher?
    self.is_a?(Teacher) || self.is_a?(Administrator)
  end

  ##
  # Wrapped method to test if user is an observer
  def observer?
    self.is_a?(Observer)
  end

  ##
  # Determines if a user has multiple languages
  def is_hybrid?
    self.languages.count > 1
  end

  def is_spanish?
    self.languages.count == 1 && self.languages[0].abbv == "es"
  end

  def is_english?
    response = self.languages.count == 1 && self.languages[0].abbv == "en"
    response = true if self.languages.count == 0
    response
  end

  ##
  # Returns type of user
  def type_string
    "User"
  end


  def cas_extra_attributes=(extra_attributes)
    extra_attributes.each do |name, value|
      case name.to_sym
      when :first_name
        self.first_name = value
      when :last_name
        self.last_name = value
      when :type
        self.type = value
      when :email
        self.email = value
      when :classroom_id
        self.classroom_id = value
      when :administrator
        self.administrator = value if !self.administrator #dont override
      when :encrypted_plain_pass
        self.encrypted_plain_pass = value
      when :encrypted_plain_pass_salt
        self.encrypted_plain_pass_salt = value
      when :encrpyted_plain_pass_iv
        self.encryped_plain_pass_iv = value
      when :special_ed
        self.special_ed = value
      when :gender
        self.gender = value
      when :grade_level
        self.grade_level = value
      when :student_id
        self.student_id = value
      when :writing_ability
        self.writing_ability = value
      when :learning_disability
        self.learning_disability = value
      when :role
        self.role = value
      when :type
        self.type = value
      end
    end
  end

  private

  # Set default column values for student record
  def set_student_defaults
    return unless type == "Student"
    unless course = Course.includes(:lessons).find_by(name: "Regular Lessons")
      raise StandardError, "Course 'Regular Lessons' not found!"
    end

    first_page = course.lessons.where(published: true).first.pages.first
    first_activity = first_page.activities.first

    self.course_id = course.id
    self.current_activity_id = first_activity.id
  end
end

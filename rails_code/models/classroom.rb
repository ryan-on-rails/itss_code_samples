class Classroom < ActiveRecord::Base
  establish_connection DMZ_CONF
  has_paper_trail

  belongs_to :school

  def current_students
  	students = []
  	puts Student.with_deleted.where(classroom_id: self.id).count
  	ActiveRecord::Base.establish_connection(DMZ_CONF).tap do
	  	students = Student.with_deleted.where(classroom_id: self.id)
		puts students.count
	end
  	puts students.count
  end
end

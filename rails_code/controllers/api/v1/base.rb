module API
  module V1
    class Base < Grape::API
      mount API::V1::Activities
      mount API::V1::Articles
      mount API::V1::Audio
      mount API::V1::Lessons
      mount API::V1::Pages
      mount API::V1::Responses
      mount API::V1::Users
      mount API::V1::Courses
      mount API::V1::Classroom
      mount API::V1::Students
      mount API::V1::Schools
    end
  end
end

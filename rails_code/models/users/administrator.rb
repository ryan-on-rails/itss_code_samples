class Administrator < User

  ##
  # Serialize the teacher information needed for the dashboard
  def serialize!
    AdminStateSerializer.new(self)
  end

  ##
  # Can the user actually use the application
  def is_supported?
    true
  end

  def admin?
    true
  end

  def type_string
    "Administrator"
  end

  ##
  # What is the default route that this type of user should be
  # redirected to on login
  def application_root
    '/admin'
  end
end

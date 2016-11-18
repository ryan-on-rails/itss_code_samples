module Orderable
  extend ActiveSupport::Concern

  # -----------------------------------------------------------------
  # Include the #orderables duck type method in the orderable model class;
  # this functions to scope the orderables appropriately. This module also
  # expects the model to have a position attribute (of type integer).
  # -----------------------------------------------------------------

  included do
    before_validation :assign_to_next_position, on: :create
    before_destroy :assign_positions_on_item_destroy
  end

  def assign_to_next_position
    self.position = orderables.size + 1
  end

  def assign_positions_on_item_destroy
    orderables.each do |o|
      next unless o.position > self.position

      o.update(position: o.position - 1)
    end
  end

  def move_up
    new_position = self.position - 1
    return self if new_position.zero?

    item_before.update(position: new_position + 1)
    self.update(position: new_position)
  end

  def move_down
    new_position = self.position + 1
    return self if new_position == orderables.size + 1

    item_after.update(position: new_position - 1)
    self.update(position: new_position)
  end

  def item_before
    orderables.find { |o| o.position == position - 1 }
  end

  def item_after
    orderables.find { |o| o.position = position + 1 }
  end

  def orderables
    raise NotImplementedError
  end
end

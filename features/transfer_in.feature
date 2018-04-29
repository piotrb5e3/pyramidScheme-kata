Feature: Transfering funds into the account
  Participants can transfer funds into their accounts

  @withStubbedQueue
  Scenario Outline: Participant succesfully transfers funds
    Given bob is a participant
    When bob transfers-in <amount> credits
    Then server responds with success
    And transfer of <amount> credits was enqueued for bob

    Examples:
      | amount |
      |      1 |
      |     10 |
      |    123 |
      |   5782 |

  @withStubbedQueue
  Scenario: Admin can't transfer funds
    Given mike is an admin
    When mike transfers-in 10 credits
    Then server responds with forbidden
    And no transfer was enqueued for mike

  Scenario: Anonymous user can't transfer funds
    When anonymous transfers-in 10 credits
    Then server responds with unauthorized

  @withStubbedQueue
  Scenario: Participant can't transfer 0 credits
    Given john is a participant
    When john transfers-in 0 credits
    Then server responds with bad request
    And no transfer was enqueued for john

Feature: Transfering funds into the account
  Participants can transfer funds into their accounts

  @withStubbedQueue
  Scenario Outline: Participant succesfully transfers funds
    Given bob is a participant
    When bob transfers-in <amount> credits
    Then server responds with success
    Then transfer of <amount> credits was enqueued for bob

    Examples:
      | amount |
      |      1 |
      |     10 |
      |    123 |
      |   5782 |

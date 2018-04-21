Feature: Transfering funds into the account
  Participants can transfer funds into their accounts

  Scenario Outline: Participant succesfully transfers funds
    Given bob is a participant
    And bob starts with balance of <start_amount> credits
    When bob transfers-in <transfer_amount> credits
    Then server responds with success
    Then bob has balance of <end_amount> credits

    Examples:
      | start_amount | transfer_amount | end_amount |
      |            5 |              10 |         15 |
      |            0 |             100 |        100 |
      |           50 |               0 |         50 |
      |            0 |               0 |          0 |


Feature: Joining a pyramid

  Participants can join a pyramid

  Background:
    Given the following users exist:
      | username | balance | isAdmin |
      |      bob |       0 |   false |
      |     mike |      10 |   false |
      |     john |     100 |   false |
      |    sarah |      50 |   false |
      |    stacy |      10 |   false |
      |     mary |       1 |   false |
      |     adam |       0 |    true |
    And pyramid created by bob exists
    And pyramid has following nodes:
      | username |  parentUsername |
      |     mike |             bob |
      |    sarah |             bob |
      |     john |            mike |

  Scenario: Anonymous user fails to join a pyramid
    When anonymous joins the pyramid off of mike
    Then server responds with unauthorized

  Scenario: Admin user fails to join a pyramid
    When adam joins the pyramid off of mike
    Then server responds with forbidden
    And no node exists for adam in the pyramid

  Scenario: Participant fails to join a nonexistent pyramid
    When stacy joins a nonexistent pyramid off of bob
    Then server responds with not found

  Scenario: Participant fails to join off a user that is not in a pyramid
    When stacy joins the pyramid off of mary
    Then server responds with not found
    And no node exists for stacy in the pyramid

  Scenario: Participant fails to join a pyramid twice
    When john joins the pyramid off of bob
    Then server responds with bad request

  Scenario: Participant fails to join a pyramid due to insufficient funds
    When mary joins the pyramid off of john
    Then server responds with bad request
    And no node exists for mary in the pyramid

  @withStubbedQueue
  Scenario: Participant joins a pyramid successfully
    When stacy joins the pyramid off of john
    Then server responds with success
    And a node exists in the pyramid for stacy with parent john
    And stacy has balance of 2 credits
    And transfer of 4 credits was enqueued for john
    And transfer of 2 credits was enqueued for mike
    And transfer of 1 credits was enqueued for bob
    And transfer of 1 credits was enqueued for treasury
    And no transfer was enqueued for sarah


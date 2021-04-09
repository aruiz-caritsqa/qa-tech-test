Feature:
  As a candidate for a testing role at ECS
  I want to solve the the Arrays Challenge
  So that I can potentially land a new job

  Scenario:
    Given I reset the session
    
    # explicit steps - able to translate directly to functions in the Steps object
    When I go to the HomePage
    Then I should not see the arraysChallengePanel
    When I click on the render-challenge
    Then I should see the arraysChallengePanel

    # implicit step - uses a mix of functions from Steps, multi-tool-package function and POM functions
    When I utilise the multi-tool to calculate the answer for each row and populate the text fields
    And I type "Adrien Ruiz Gauder" into the submit-4
    And I click on the submitButton
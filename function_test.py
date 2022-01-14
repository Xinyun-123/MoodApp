from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time


chrome_path = r'/usr/local/bin/chromedriver' #path from 'which chromedriver'
driver = webdriver.Chrome(executable_path=chrome_path)

url="https://xinyun-mood-app.herokuapp.com/"
driver.get(url)

#login
driver.find_element_by_link_text("login").click()
driver.find_element_by_name("username").send_keys("test")
driver.find_element_by_name("password").send_keys("test1234")
driver.find_element_by_id("btn").click()
print("login test passed")



#add mood
time.sleep(2)
driver.find_element_by_link_text("Add Mood").click()
driver.find_element_by_name("createdAt").send_keys("2021-11-27")
driver.find_element_by_name("mtype").send_keys("Okay")
driver.find_element_by_name("note").send_keys("Nothing happened")
driver.find_element_by_id("btn").click()
print("add mood test passed")


#view history
time.sleep(2)
driver.find_element_by_link_text("History Mood").click()
assert ("2021-11-27" in driver.page_source)
time.sleep(1)
driver.back()
print("view mood history test passed") 



# delete mood
time.sleep(2)
driver.find_element_by_link_text("Delete Mood").click()
driver.find_element_by_name("createdAt").send_keys("2021-11-27")
driver.find_element_by_id("btn").click()
assert ("2021-11-27" not in driver.page_source)
print("delete mood test passed") 


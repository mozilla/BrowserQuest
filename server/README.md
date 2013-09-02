BrowserQuest server documentation
=================================

To configure and run the BrowserQuest server, please follow the instructions in the top directory of this repository.


Monitoring
----------

The server has a status URL which can be used as a health check or simply as a way to monitor player population.

Send a GET request to: `http://[host]:[port]/status`

It will return a JSON array containing the number of players in all instanced worlds on this game server.


Useful note
-----------

The `shared` directory is the only one in the project which is a server dependency.
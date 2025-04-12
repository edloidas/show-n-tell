package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
)

// AppError represents custom error types
type AppError struct {
	Type    string
	Message string
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

// User represents a user entity
type User struct {
	Name string `json:"name"`
	Age  uint32 `json:"age"`
}

// RepoNode represents a generic node with data
type RepoNode[T any] struct {
	Data T
	ID   string
}

func fetchCurrentUser() (string, error) {
	if rand.Float64() > 0.5 {
		return `{"name":"John","age":30}`, nil
	}
	return "", &AppError{Type: "FetchError", Message: "Network error"}
}

func parseData(data string) (User, error) {
	var user User
	err := json.Unmarshal([]byte(data), &user)
	if err != nil {
		return User{}, &AppError{Type: "ParseError", Message: err.Error()}
	}
	return user, nil
}

func modifyNode(data User) (string, error) {
	if data.Age > 0 {
		return fmt.Sprintf("Saved user: %s", data.Name), nil
	}
	return "", &AppError{Type: "NodeError", Message: "Invalid age"}
}

func main() {
	jsonData, err := fetchCurrentUser()
	if err != nil {
		fmt.Printf("Failed: %v\n", err)
		return
	}

	user, err := parseData(jsonData)
	if err != nil {
		fmt.Printf("Failed: %v\n", err)
		return
	}

	msg, err := modifyNode(user)
	if err != nil {
		fmt.Printf("Failed: %v\n", err)
		return
	}

	fmt.Printf("Success: %s\n", msg)
}

import java.util.Random;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

// * Custom Exception Hierarchy

class AppException extends Exception {
    public AppException(String message) {
        super(message);
    }

    public AppException(String message, Throwable cause) {
        super(message, cause);
    }
}

class FetchException extends AppException {
    public FetchException(String message) {
        super(message);
    }
}

class ParseException extends AppException {
    public ParseException(String message, Throwable cause) {
        super(message, cause);
    }
}

class NodeException extends AppException {
    public NodeException(String message) {
        super(message);
    }
}

// * Data Structures

class User {
    String name;
    int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" + "name='" + name + '\'' + ", age=" + age + '}';
    }
}

// * Simulated Service Functions

class ExampleService {
    private static final Random random = new Random();
    private static final Gson gson = new Gson();

    public static String fetchCurrentUser() throws FetchException {
        if (random.nextBoolean()) {
            return "{\"name\":\"Alice\",\"age\":30}";
        } else {
            throw new FetchException("Network error during fetch");
        }
    }

    public static User parseData(String data) throws ParseException {
        try {
            User user = gson.fromJson(data, User.class);
            if (user == null || user.name == null) {
                 throw new JsonSyntaxException("Parsed user or name is null");
            }
            return user;
        } catch (JsonSyntaxException e) {
            throw new ParseException("Failed to parse user data", e);
        }
    }

    public static String modifyNode(User data) throws NodeException {
        if (data.age > 0) {
            return "Saved user: " + data.name;
        } else {
            throw new NodeException("Invalid age: " + data.age);
        }
    }

    public static String fetchAndUpdateUser() throws FetchException, ParseException, NodeException {
        String jsonData = fetchCurrentUser();
        System.out.println("1. User Fetched (raw): " + jsonData);

        User user = parseData(jsonData);
        System.out.println("2. Data Parsed: " + user);

        String resultMessage = modifyNode(user);
        System.out.println("3. Node Modified: " + resultMessage);

        return resultMessage;
    }

    public static void main(String[] args) {
        try {
            String result = fetchAndUpdateUser();
            System.out.println("Success: " + result);
        } catch (FetchException e) {
            System.err.println("Failed (Fetch): " + e.getMessage());
        } catch (ParseException e) {
            System.err.println("Failed (Parse): " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("  Cause: " + e.getCause().getMessage());
            }
        } catch (NodeException e) {
            System.err.println("Failed (Node): " + e.getMessage());
        } catch (AppException e) {
            System.err.println("Failed (Generic App): " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Failed (Unexpected): " + e.getMessage());
            e.printStackTrace();
        }
    }
}

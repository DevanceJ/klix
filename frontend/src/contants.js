const BOILERPLATE = {
  javascript: `// JavaScript Boilerplate
  
  function main() {
    console.log('Hello, World!');
  }
  
  main();
  `,

  python: `# Python Boilerplate
  
def main():
  print('Hello, World!')

main()
`,

  java: `// Java Boilerplate
  
  public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }
  `,

  cpp: `// C++ Boilerplate
  
  #include <iostream>
  using namespace std;

  int main() {
      cout << "Hello, World!" << endl;
      return 0;
  }
  `,
};

export default BOILERPLATE;

// GET /api/v2/runtimes <- modify to call from this endpoint for versions
// Hardcoded for now to test functionality

export const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  javascript: "1.32.3",
  java: "15.0.2",
  cpp: "10.2.0",
};

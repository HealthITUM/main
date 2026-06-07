import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#CCE7C9",
  },

  baseText: {
    color: "white",
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "white",
  },

  link: {
    color: "white",
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  linkHover: {
    color: "#535bf2",
  },

  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#1a1a1a",
  },

  buttonText: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },

  darkGreenButton: {
    backgroundColor: "#658354",
    borderRadius: 8,
    padding: 12,
  },

  darkGreenButtonText: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ translateY: 2 }],
  },

  darkGreenNavbar: {
    backgroundColor: "#4B6043",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  darkGreenCard: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#4B6043",
    padding: 16,
    borderRadius: 12,
  },

  darkGreenCardTitle: {
    fontWeight: "800",
    color: "white",
  },

  lighterCard: {
    backgroundColor: "#A3C585",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
    padding: 16,
  },

  lighterCardTitle: {
    color: "#4B6043",
    fontWeight: "800",
  },

  lighterCardText: {
    color: "#4B6043",
    fontWeight: "400",
  },

  lighterCardLink: {
    color: "#4B6043",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 10,
    color: "#4B6043",
    fontWeight: "500",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },

  inputPlaceholder: {
    color: "#8aa08a",
  },

  inputFocus: {
    shadowColor: "#658354",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  textarea: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 10,
    minHeight: 120,
    color: "#4B6043",
    textAlignVertical: "top",
  },

  dropdown: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  dropdownItem: {
    padding: 10,
    borderRadius: 10,
  },

  dropdownItemText: {
    color: "#4B6043",
    fontWeight: "500",
  },

  dropdownItemActive: {
    backgroundColor: "#658354",
  },

  dropdownItemActiveText: {
    color: "white",
  },

  select: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 10,
    color: "#4B6043",
    fontWeight: "500",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },

  errorBox: {
    backgroundColor: "#ffdddd",
    padding: 10,
    borderRadius: 8,
  },

  errorText: {
    color: "#ff6b6b",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreen: {
    flex: 1,
  },

  spacing: {
    marginBottom: 12,
  },

profileButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
},

profileButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
},

dropdownMenu: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 8,
    width: 150,
    elevation: 30,
    zIndex: 9999,
},

dropdownText: {
    fontSize: 15,
    color: "#1f5c42",
},
});
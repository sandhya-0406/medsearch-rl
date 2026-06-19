class NavigationEngine:

    def get_center(self):

        center_x = self.x + self.width // 2
        center_y = self.y + self.height // 2

        return [center_x, center_y]


    def clip_window(self):

        self.x = max(
            0,
            min(
                self.x,
                512 - self.width
            )
        )

        self.y = max(
            0,
            min(
                self.y,
                512 - self.height
            )
        )


    def zoom_in(self):

        center_x = self.x + self.width / 2
        center_y = self.y + self.height / 2

        self.width = int(self.width * 0.8)
        self.height = int(self.height * 0.8)

        self.width = max(32, self.width)
        self.height = max(32, self.height)

        self.x = int(
            center_x - self.width / 2
        )

        self.y = int(
            center_y - self.height / 2
        )

        self.clip_window()


    def zoom_out(self):

        center_x = self.x + self.width / 2
        center_y = self.y + self.height / 2

        self.width = int(self.width * 1.2)
        self.height = int(self.height * 1.2)

        self.width = min(512, self.width)
        self.height = min(512, self.height)

        self.x = int(
            center_x - self.width / 2
        )

        self.y = int(
            center_y - self.height / 2
        )

        self.clip_window()


    def get_trajectory(self):

        return self.trajectory


    def get_episode_data(self):

        return {

            "trajectory": self.trajectory,

            "actions": self.action_history,

            "rewards": self.reward_history,

            "ious": self.iou_history,

            "windows": self.window_history

        }
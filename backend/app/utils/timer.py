import time
from typing import Optional
from datetime import datetime, timedelta

class Timer:
    """Utility class for exam timing functionality"""
    
    def __init__(self):
        self.start_time: Optional[float] = None
        self.duration_minutes: Optional[int] = None
    
    def start_timer(self, duration_minutes: int):
        """
        Start the exam timer
        
        Args:
            duration_minutes: Exam duration in minutes
        """
        self.start_time = time.time()
        self.duration_minutes = duration_minutes
    
    def get_elapsed_time(self) -> int:
        """
        Get elapsed time in seconds
        
        Returns:
            Elapsed time in seconds, or 0 if timer not started
        """
        if self.start_time is None:
            return 0
        
        return int(time.time() - self.start_time)
    
    def get_remaining_time(self) -> int:
        """
        Get remaining time in seconds
        
        Returns:
            Remaining time in seconds, or 0 if timer not started or expired
        """
        if self.start_time is None or self.duration_minutes is None:
            return 0
        
        elapsed = self.get_elapsed_time()
        total_seconds = self.duration_minutes * 60
        remaining = total_seconds - elapsed
        
        return max(0, remaining)
    
    def is_expired(self) -> bool:
        """
        Check if the timer has expired
        
        Returns:
            True if timer has expired, False otherwise
        """
        return self.get_remaining_time() == 0
    
    def get_formatted_time(self, seconds: int) -> str:
        """
        Format time in MM:SS format
        
        Args:
            seconds: Time in seconds
            
        Returns:
            Formatted time string (MM:SS)
        """
        minutes = seconds // 60
        remaining_seconds = seconds % 60
        return f"{minutes:02d}:{remaining_seconds:02d}"
    
    def get_formatted_elapsed_time(self) -> str:
        """Get formatted elapsed time"""
        return self.get_formatted_time(self.get_elapsed_time())
    
    def get_formatted_remaining_time(self) -> str:
        """Get formatted remaining time"""
        return self.get_formatted_time(self.get_remaining_time())
    
    def reset(self):
        """Reset the timer"""
        self.start_time = None
        self.duration_minutes = None
    
    @staticmethod
    def calculate_time_taken(start_timestamp: str, end_timestamp: str) -> int:
        """
        Calculate time taken between two timestamps
        
        Args:
            start_timestamp: Start time in ISO format
            end_timestamp: End time in ISO format
            
        Returns:
            Time taken in seconds
        """
        try:
            start_dt = datetime.fromisoformat(start_timestamp.replace('Z', '+00:00'))
            end_dt = datetime.fromisoformat(end_timestamp.replace('Z', '+00:00'))
            
            time_diff = end_dt - start_dt
            return int(time_diff.total_seconds())
        except Exception:
            return 0
    
    @staticmethod
    def format_duration(seconds: int) -> str:
        """
        Format duration in human-readable format
        
        Args:
            seconds: Duration in seconds
            
        Returns:
            Formatted duration string (e.g., "5m 30s", "1h 15m")
        """
        if seconds < 60:
            return f"{seconds}s"
        elif seconds < 3600:
            minutes = seconds // 60
            remaining_seconds = seconds % 60
            if remaining_seconds == 0:
                return f"{minutes}m"
            return f"{minutes}m {remaining_seconds}s"
        else:
            hours = seconds // 3600
            remaining_minutes = (seconds % 3600) // 60
            if remaining_minutes == 0:
                return f"{hours}h"
            return f"{hours}h {remaining_minutes}m"
